"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PAYMENT_METHODS } from "@/lib/finance-types";

// ---- Record a payment ----

const recordPaymentSchema = z.object({
  invoiceId: z.string().min(1),
  amount: z.number().int().min(1), // halalas
  method: z.enum(PAYMENT_METHODS as [string, ...string[]]),
  reference: z.string().max(200).optional().or(z.literal("")),
  notes: z.string().max(500).optional().or(z.literal("")),
  installmentId: z.string().optional().or(z.literal("")),
});

export type RecordPaymentInput = z.infer<typeof recordPaymentSchema>;

export type RecordPaymentState = {
  error?: "validation" | "exceeds_balance" | "generic";
  success?: boolean;
};

export async function recordPayment(input: RecordPaymentInput): Promise<RecordPaymentState> {
  const parsed = recordPaymentSchema.safeParse(input);
  if (!parsed.success) return { error: "validation" };

  const { invoiceId, amount, method, reference, notes, installmentId } = parsed.data;

  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        totalAmount: true,
        status: true,
        payments: { where: { status: "completed" }, select: { amount: true } },
        installments: { select: { id: true, amount: true, status: true } },
      },
    });
    if (!invoice) return { error: "generic" };

    const paidSoFar = invoice.payments.reduce((s, p) => s + p.amount, 0);
    const balance = invoice.totalAmount - paidSoFar;
    if (amount > balance) return { error: "exceeds_balance" };

    await prisma.payment.create({
      data: {
        amount,
        method: method as never,
        status: "completed",
        reference: reference || null,
        notes: notes || null,
        invoiceId,
        installmentId: installmentId || null,
      },
    });

    const newPaidTotal = paidSoFar + amount;
    const newStatus =
      newPaidTotal >= invoice.totalAmount
        ? "paid"
        : newPaidTotal > 0
          ? "partially_paid"
          : invoice.status;

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: newStatus as never },
    });

    if (installmentId) {
      const installment = invoice.installments.find((i) => i.id === installmentId);
      if (installment) {
        const installmentPaid = await prisma.payment.aggregate({
          where: { installmentId, status: "completed" },
          _sum: { amount: true },
        });
        const totalPaidForInstallment = (installmentPaid._sum.amount ?? 0) + amount;
        if (totalPaidForInstallment >= installment.amount) {
          await prisma.installment.update({
            where: { id: installmentId },
            data: { status: "paid" },
          });
        }
      }
    }
  } catch {
    return { error: "generic" };
  }

  revalidatePath("/[locale]/(app)/finance", "page");
  revalidatePath("/[locale]/(app)/dashboard", "page");
  return { success: true };
}

// ---- Send a payment reminder (simulated — no email infra yet) ----

const sendReminderSchema = z.object({
  invoiceId: z.string().min(1),
});

export type SendReminderState = {
  error?: "validation" | "generic";
  success?: boolean;
};

export async function sendReminder(input: { invoiceId: string }): Promise<SendReminderState> {
  const parsed = sendReminderSchema.safeParse(input);
  if (!parsed.success) return { error: "validation" };

  const invoice = await prisma.invoice.findUnique({
    where: { id: parsed.data.invoiceId },
    select: { id: true },
  });
  if (!invoice) return { error: "generic" };

  return { success: true };
}
