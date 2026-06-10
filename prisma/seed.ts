import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

// halalas helper: SAR -> halalas
const sar = (amount: number) => amount * 100;

function daysFrom(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

async function main() {
  const passwordHash = await bcrypt.hash("Passw0rd!", 10);
  const now = new Date("2026-06-10T08:00:00.000Z");

  // -------------------------------------------------------------------------
  // Staff users
  // -------------------------------------------------------------------------
  const staffData = [
    { email: "sara.alqahtani@eventpro.sa", nameAr: "سارة القحطاني", nameEn: "Sara Al-Qahtani" },
    { email: "omar.harbi@eventpro.sa", nameAr: "عمر الحربي", nameEn: "Omar Al-Harbi" },
    { email: "lama.otaibi@eventpro.sa", nameAr: "لمى العتيبي", nameEn: "Lama Al-Otaibi" },
    { email: "khalid.dosari@eventpro.sa", nameAr: "خالد الدوسري", nameEn: "Khalid Al-Dosari" },
  ];

  const staffUsers = [];
  for (const s of staffData) {
    staffUsers.push(
      await prisma.user.create({
        data: {
          email: s.email,
          passwordHash,
          nameAr: s.nameAr,
          nameEn: s.nameEn,
          role: "staff",
        },
      }),
    );
  }
  const [salesLead, accountManager, productionLead, opsCoordinator] = staffUsers;

  // -------------------------------------------------------------------------
  // Clients (10) with contacts and portal users
  // -------------------------------------------------------------------------
  const clientSeeds = [
    {
      nameAr: "شركة الرياض للتطوير العقاري",
      nameEn: "Riyadh Real Estate Development Co.",
      companyNameAr: "شركة الرياض للتطوير العقاري",
      companyNameEn: "Riyadh Real Estate Development Co.",
      email: "info@riyadh-red.sa",
      phone: "+966112345001",
      addressAr: "طريق الملك فهد، الرياض",
      addressEn: "King Fahd Road, Riyadh",
      contact: { nameAr: "فهد المطيري", nameEn: "Fahad Al-Mutairi", titleAr: "مدير التسويق", titleEn: "Marketing Manager", email: "fahad@riyadh-red.sa", phone: "+966501110001" },
    },
    {
      nameAr: "بنك الجزيرة",
      nameEn: "Bank Aljazira",
      companyNameAr: "بنك الجزيرة",
      companyNameEn: "Bank Aljazira",
      email: "events@bankaljazira.com",
      phone: "+966112345002",
      addressAr: "شارع العليا العام، الرياض",
      addressEn: "Olaya General Street, Riyadh",
      contact: { nameAr: "نورة الشهري", nameEn: "Noura Al-Shehri", titleAr: "مديرة العلاقات العامة", titleEn: "PR Manager", email: "noura.shehri@bankaljazira.com", phone: "+966501110002" },
    },
    {
      nameAr: "مجموعة المراعي",
      nameEn: "Almarai Group",
      companyNameAr: "شركة المراعي",
      companyNameEn: "Almarai Company",
      email: "marketing@almarai.com",
      phone: "+966112345003",
      addressAr: "طريق الخرج، الرياض",
      addressEn: "Al Kharj Road, Riyadh",
      contact: { nameAr: "ماجد القرني", nameEn: "Majed Al-Qarni", titleAr: "مدير الفعاليات", titleEn: "Events Manager", email: "majed.qarni@almarai.com", phone: "+966501110003" },
    },
    {
      nameAr: "هيئة تطوير محمية الملك سلمان",
      nameEn: "King Salman Park Foundation",
      companyNameAr: "هيئة تطوير محمية الملك سلمان",
      companyNameEn: "King Salman Park Foundation",
      email: "contact@kspf.gov.sa",
      phone: "+966112345004",
      addressAr: "حي الملقا، الرياض",
      addressEn: "Al Malqa District, Riyadh",
      contact: { nameAr: "ريم الزهراني", nameEn: "Reem Al-Zahrani", titleAr: "منسقة الفعاليات", titleEn: "Events Coordinator", email: "reem.zahrani@kspf.gov.sa", phone: "+966501110004" },
    },
    {
      nameAr: "شركة stc",
      nameEn: "stc",
      companyNameAr: "الشركة السعودية للاتصالات",
      companyNameEn: "Saudi Telecom Company",
      email: "sponsorships@stc.com.sa",
      phone: "+966112345005",
      addressAr: "طريق الأمير تركي، الرياض",
      addressEn: "Prince Turki Road, Riyadh",
      contact: { nameAr: "سلطان الغامدي", nameEn: "Sultan Al-Ghamdi", titleAr: "مدير الرعايات", titleEn: "Sponsorships Manager", email: "sultan.ghamdi@stc.com.sa", phone: "+966501110005" },
    },
    {
      nameAr: "جامعة الملك سعود",
      nameEn: "King Saud University",
      companyNameAr: "جامعة الملك سعود",
      companyNameEn: "King Saud University",
      email: "events@ksu.edu.sa",
      phone: "+966112345006",
      addressAr: "طريق الملك خالد، الرياض",
      addressEn: "King Khalid Road, Riyadh",
      contact: { nameAr: "عبدالله الشمري", nameEn: "Abdullah Al-Shammari", titleAr: "عميد شؤون الطلاب", titleEn: "Dean of Student Affairs", email: "a.shammari@ksu.edu.sa", phone: "+966501110006" },
    },
    {
      nameAr: "مجموعة جرير للتسويق",
      nameEn: "Jarir Marketing Group",
      companyNameAr: "شركة جرير للتسويق",
      companyNameEn: "Jarir Marketing Co.",
      email: "events@jarir.com",
      phone: "+966112345007",
      addressAr: "طريق الدائري الشرقي، الرياض",
      addressEn: "Eastern Ring Road, Riyadh",
      contact: { nameAr: "هند العنزي", nameEn: "Hind Al-Anzi", titleAr: "منسقة معارض", titleEn: "Exhibitions Coordinator", email: "hind.anzi@jarir.com", phone: "+966501110007" },
    },
    {
      nameAr: "شركة المراعي للأغذية - فرع جدة",
      nameEn: "Red Sea Global",
      companyNameAr: "شركة البحر الأحمر العالمية",
      companyNameEn: "Red Sea Global",
      email: "events@redseaglobal.com",
      phone: "+966122345008",
      addressAr: "طريق الكورنيش، جدة",
      addressEn: "Corniche Road, Jeddah",
      contact: { nameAr: "ياسر باقادر", nameEn: "Yasser Baqader", titleAr: "مدير الفعاليات الإقليمية", titleEn: "Regional Events Director", email: "yasser.baqader@redseaglobal.com", phone: "+966501110008" },
    },
    {
      nameAr: "نادي الهلال السعودي",
      nameEn: "Al-Hilal Saudi Club",
      companyNameAr: "نادي الهلال السعودي",
      companyNameEn: "Al-Hilal Saudi Club",
      email: "marketing@alhilal.com",
      phone: "+966112345009",
      addressAr: "طريق الملك عبدالله، الرياض",
      addressEn: "King Abdullah Road, Riyadh",
      contact: { nameAr: "تركي الدوسري", nameEn: "Turki Al-Dosari", titleAr: "مدير التسويق والرعايات", titleEn: "Marketing & Sponsorships Director", email: "turki.dosari@alhilal.com", phone: "+966501110009" },
    },
    {
      nameAr: "وزارة السياحة",
      nameEn: "Ministry of Tourism",
      companyNameAr: "وزارة السياحة",
      companyNameEn: "Ministry of Tourism",
      email: "events@mt.gov.sa",
      phone: "+966112345010",
      addressAr: "حي الدبلوماسي، الرياض",
      addressEn: "Diplomatic Quarter, Riyadh",
      contact: { nameAr: "منيرة السبيعي", nameEn: "Muneera Al-Subaie", titleAr: "مديرة إدارة الفعاليات", titleEn: "Events Department Manager", email: "muneera.subaie@mt.gov.sa", phone: "+966501110010" },
    },
  ];

  const clients: Awaited<ReturnType<typeof prisma.client.create>>[] = [];
  for (const c of clientSeeds) {
    const client = await prisma.client.create({
      data: {
        nameAr: c.nameAr,
        nameEn: c.nameEn,
        companyNameAr: c.companyNameAr,
        companyNameEn: c.companyNameEn,
        email: c.email,
        phone: c.phone,
        addressAr: c.addressAr,
        addressEn: c.addressEn,
        notes: `عميل منذ ${2021 + (clients.length % 4)} / Client since ${2021 + (clients.length % 4)}`,
        contacts: {
          create: {
            ...c.contact,
            isPrimary: true,
          },
        },
      },
    });
    clients.push(client);
  }

  // Portal users for the first three clients
  const portalUsersData = [
    { client: clients[0], email: "fahad@riyadh-red.sa", nameAr: "فهد المطيري", nameEn: "Fahad Al-Mutairi" },
    { client: clients[1], email: "noura.shehri@bankaljazira.com", nameAr: "نورة الشهري", nameEn: "Noura Al-Shehri" },
    { client: clients[2], email: "majed.qarni@almarai.com", nameAr: "ماجد القرني", nameEn: "Majed Al-Qarni" },
  ];
  for (const p of portalUsersData) {
    await prisma.user.create({
      data: {
        email: p.email,
        passwordHash,
        nameAr: p.nameAr,
        nameEn: p.nameEn,
        role: "client",
        clientId: p.client.id,
      },
    });
  }

  // -------------------------------------------------------------------------
  // Opportunities across all CRM stages (one per client + extras)
  // -------------------------------------------------------------------------
  const stages: Array<"lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost"> = [
    "lead",
    "qualified",
    "proposal",
    "negotiation",
    "won",
    "won",
    "won",
    "lost",
    "qualified",
    "proposal",
  ];

  const opportunitySeeds = [
    { titleAr: "معرض الرياض العقاري السنوي", titleEn: "Riyadh Annual Real Estate Expo", value: 850_000 },
    { titleAr: "مؤتمر بنك الجزيرة المصرفي", titleEn: "Bank Aljazira Banking Forum", value: 620_000 },
    { titleAr: "يوم المراعي المفتوح للموردين", titleEn: "Almarai Suppliers Open Day", value: 410_000 },
    { titleAr: "افتتاح محمية الملك سلمان", titleEn: "King Salman Park Launch Event", value: 1_250_000 },
    { titleAr: "مؤتمر stc للابتكار", titleEn: "stc Innovation Summit", value: 980_000 },
    { titleAr: "معرض التوظيف بجامعة الملك سعود", titleEn: "KSU Career Fair", value: 320_000 },
    { titleAr: "معرض جرير للتقنية", titleEn: "Jarir Tech Showcase", value: 540_000 },
    { titleAr: "مؤتمر البحر الأحمر للسياحة", titleEn: "Red Sea Tourism Conference", value: 1_500_000 },
    { titleAr: "حفل تكريم لاعبي الهلال", titleEn: "Al-Hilal Players Recognition Gala", value: 280_000 },
    { titleAr: "ملتقى وزارة السياحة الإقليمي", titleEn: "Ministry of Tourism Regional Forum", value: 700_000 },
  ];

  const opportunities = [];
  for (let i = 0; i < opportunitySeeds.length; i++) {
    const o = opportunitySeeds[i];
    const stage = stages[i];
    const owner = [salesLead, accountManager, opsCoordinator][i % 3];
    opportunities.push(
      await prisma.opportunity.create({
        data: {
          titleAr: o.titleAr,
          titleEn: o.titleEn,
          stage,
          estimatedValue: sar(o.value),
          expectedCloseDate: stage === "won" || stage === "lost" ? daysFrom(now, -30 + i) : daysFrom(now, 20 + i * 5),
          notes:
            stage === "lost"
              ? "تم اختيار مزود آخر بسبب الميزانية / Lost to a competitor on price"
              : stage === "won"
                ? "تم توقيع العقد / Contract signed"
                : "قيد المتابعة مع العميل / Following up with client",
          clientId: clients[i].id,
          ownerId: owner.id,
        },
      }),
    );
  }

  // -------------------------------------------------------------------------
  // Events for the "won" opportunities (3) + 2 extra confirmed/in-progress events
  // -------------------------------------------------------------------------
  const wonIndexes = [4, 5, 6]; // opportunities[4..6] are "won"

  const eventSeeds = [
    {
      opp: opportunities[wonIndexes[0]],
      client: clients[wonIndexes[0]],
      nameAr: "مؤتمر stc للابتكار 2026",
      nameEn: "stc Innovation Summit 2026",
      descriptionAr: "مؤتمر تقني سنوي يجمع قادة الابتكار في المملكة",
      descriptionEn: "Annual tech conference gathering innovation leaders across the Kingdom",
      venueAr: "مركز الرياض الدولي للمؤتمرات والمعارض",
      venueEn: "Riyadh International Convention & Exhibition Center",
      start: daysFrom(now, 15),
      end: daysFrom(now, 17),
      status: "confirmed" as const,
    },
    {
      opp: opportunities[wonIndexes[1]],
      client: clients[wonIndexes[1]],
      nameAr: "معرض التوظيف بجامعة الملك سعود",
      nameEn: "KSU Career Fair",
      descriptionAr: "معرض توظيف سنوي لطلاب وخريجي الجامعة",
      descriptionEn: "Annual career fair for university students and graduates",
      venueAr: "قاعة الأمير سلطان، جامعة الملك سعود",
      venueEn: "Prince Sultan Hall, King Saud University",
      start: daysFrom(now, -5),
      end: daysFrom(now, -3),
      status: "completed" as const,
    },
    {
      opp: opportunities[wonIndexes[2]],
      client: clients[wonIndexes[2]],
      nameAr: "معرض جرير للتقنية",
      nameEn: "Jarir Tech Showcase",
      descriptionAr: "معرض لأحدث المنتجات التقنية والإلكترونيات",
      descriptionEn: "Showcase of the latest tech products and electronics",
      venueAr: "فندق الفيصلية، الرياض",
      venueEn: "Al Faisaliah Hotel, Riyadh",
      start: daysFrom(now, 1),
      end: daysFrom(now, 2),
      status: "in_progress" as const,
    },
    {
      opp: null,
      client: clients[0],
      nameAr: "معرض الرياض العقاري السنوي",
      nameEn: "Riyadh Annual Real Estate Expo",
      descriptionAr: "أكبر تجمع لمطوري العقارات في المملكة",
      descriptionEn: "The largest gathering of real estate developers in the Kingdom",
      venueAr: "مركز الرياض الدولي للمؤتمرات والمعارض",
      venueEn: "Riyadh International Convention & Exhibition Center",
      start: daysFrom(now, 45),
      end: daysFrom(now, 48),
      status: "confirmed" as const,
    },
    {
      opp: null,
      client: clients[3],
      nameAr: "افتتاح محمية الملك سلمان - المرحلة الأولى",
      nameEn: "King Salman Park Phase One Launch",
      descriptionAr: "حفل افتتاح المرحلة الأولى من محمية الملك سلمان",
      descriptionEn: "Launch ceremony for phase one of King Salman Park",
      venueAr: "محمية الملك سلمان، الرياض",
      venueEn: "King Salman Park, Riyadh",
      start: daysFrom(now, 60),
      end: daysFrom(now, 60),
      status: "draft" as const,
    },
  ];

  const events = [];
  for (const e of eventSeeds) {
    events.push(
      await prisma.event.create({
        data: {
          nameAr: e.nameAr,
          nameEn: e.nameEn,
          descriptionAr: e.descriptionAr,
          descriptionEn: e.descriptionEn,
          venueAr: e.venueAr,
          venueEn: e.venueEn,
          startDate: e.start,
          endDate: e.end,
          status: e.status,
          clientId: e.client.id,
          opportunityId: e.opp ? e.opp.id : null,
        },
      }),
    );
  }
  const [stcEvent, ksuEvent, jarirEvent, realEstateEvent, kingSalmanEvent] = events;

  // -------------------------------------------------------------------------
  // Booth floor plan for the real estate expo + tech showcase
  // -------------------------------------------------------------------------
  const boothFloorPlans: Array<{ event: (typeof events)[number]; booths: Array<{ codeAr: string; codeEn: string; area: number; price: number; status: "available" | "reserved" | "unavailable" }> }> = [
    {
      event: realEstateEvent,
      booths: [
        { codeAr: "أ-01", codeEn: "A-01", area: 36, price: 18_000, status: "reserved" },
        { codeAr: "أ-02", codeEn: "A-02", area: 36, price: 18_000, status: "reserved" },
        { codeAr: "أ-03", codeEn: "A-03", area: 24, price: 12_000, status: "available" },
        { codeAr: "ب-01", codeEn: "B-01", area: 50, price: 25_000, status: "reserved" },
        { codeAr: "ب-02", codeEn: "B-02", area: 50, price: 25_000, status: "available" },
        { codeAr: "ج-01", codeEn: "C-01", area: 18, price: 9_000, status: "unavailable" },
        { codeAr: "ج-02", codeEn: "C-02", area: 18, price: 9_000, status: "available" },
        { codeAr: "ج-03", codeEn: "C-03", area: 18, price: 9_000, status: "available" },
      ],
    },
    {
      event: jarirEvent,
      booths: [
        { codeAr: "ج1-01", codeEn: "T-01", area: 30, price: 15_000, status: "reserved" },
        { codeAr: "ج1-02", codeEn: "T-02", area: 30, price: 15_000, status: "reserved" },
        { codeAr: "ج1-03", codeEn: "T-03", area: 20, price: 10_000, status: "available" },
        { codeAr: "ج1-04", codeEn: "T-04", area: 20, price: 10_000, status: "unavailable" },
      ],
    },
  ];

  const boothMap: Record<string, Awaited<ReturnType<typeof prisma.booth.create>>> = {};
  for (const plan of boothFloorPlans) {
    for (const b of plan.booths) {
      const booth = await prisma.booth.create({
        data: {
          codeAr: b.codeAr,
          codeEn: b.codeEn,
          descriptionAr: `جناح عرض بمساحة ${b.area} متر مربع`,
          descriptionEn: `Exhibition booth, ${b.area} sqm`,
          areaSqm: b.area,
          basePrice: sar(b.price),
          status: b.status,
          eventId: plan.event.id,
        },
      });
      boothMap[`${plan.event.id}:${b.codeEn}`] = booth;
    }
  }

  // Booth bookings for the reserved booths
  const boothBookingSeeds = [
    { booth: boothMap[`${realEstateEvent.id}:A-01`], client: clients[1], price: 18_000, status: "confirmed" as const },
    { booth: boothMap[`${realEstateEvent.id}:A-02`], client: clients[2], price: 17_000, status: "confirmed" as const },
    { booth: boothMap[`${realEstateEvent.id}:B-01`], client: clients[4], price: 25_000, status: "confirmed" as const },
    { booth: boothMap[`${jarirEvent.id}:T-01`], client: clients[6], price: 15_000, status: "confirmed" as const },
    { booth: boothMap[`${jarirEvent.id}:T-02`], client: clients[5], price: 14_000, status: "held" as const },
  ];

  const boothBookings = [];
  for (const bb of boothBookingSeeds) {
    boothBookings.push(
      await prisma.boothBooking.create({
        data: {
          boothId: bb.booth.id,
          eventId: bb.booth.eventId,
          clientId: bb.client.id,
          price: sar(bb.price),
          status: bb.status,
          notes: bb.status === "held" ? "بانتظار تأكيد الدفعة المقدمة / Awaiting deposit confirmation" : null,
        },
      }),
    );
  }

  // -------------------------------------------------------------------------
  // Production orders, steps, materials (for stcEvent, jarirEvent, realEstateEvent)
  // -------------------------------------------------------------------------
  const productionSeeds = [
    {
      event: stcEvent,
      titleAr: "إنتاج وتجهيز مسرح القمة الرئيسي",
      titleEn: "Main Stage Production & Setup",
      descriptionAr: "تصميم وتنفيذ المسرح الرئيسي والإضاءة والصوت",
      descriptionEn: "Design and execution of main stage, lighting, and sound",
      status: "in_progress" as const,
      due: daysFrom(now, 14),
      steps: [
        { nameAr: "تصميم المسرح ثلاثي الأبعاد", nameEn: "3D Stage Design", status: "completed" as const, seq: 1, done: -10 },
        { nameAr: "طلب وتوريد المواد", nameEn: "Material Procurement", status: "completed" as const, seq: 2, done: -5 },
        { nameAr: "بناء الهيكل الإنشائي", nameEn: "Structural Build", status: "in_progress" as const, seq: 3, done: null },
        { nameAr: "تركيب الإضاءة والصوت", nameEn: "Lighting & Sound Install", status: "pending" as const, seq: 4, done: null },
        { nameAr: "التشغيل التجريبي", nameEn: "Technical Rehearsal", status: "pending" as const, seq: 5, done: null },
      ],
      materials: [
        { nameAr: "ألواح خشب MDF", nameEn: "MDF Boards", unitAr: "لوح", unitEn: "panel", qty: 120, cost: 85 },
        { nameAr: "هيكل تروس معدني", nameEn: "Truss Structure", unitAr: "متر", unitEn: "meter", qty: 60, cost: 220 },
        { nameAr: "كشافات LED", nameEn: "LED Fixtures", unitAr: "قطعة", unitEn: "unit", qty: 40, cost: 350 },
      ],
    },
    {
      event: jarirEvent,
      titleAr: "تجهيز أجنحة العرض التقني",
      titleEn: "Tech Showcase Booth Build-out",
      descriptionAr: "تصنيع وتركيب أجنحة العرض وشاشات العرض",
      descriptionEn: "Fabrication and installation of display booths and screens",
      status: "completed" as const,
      due: daysFrom(now, -1),
      steps: [
        { nameAr: "تصميم الأجنحة", nameEn: "Booth Design", status: "completed" as const, seq: 1, done: -8 },
        { nameAr: "تصنيع الهياكل", nameEn: "Structure Fabrication", status: "completed" as const, seq: 2, done: -4 },
        { nameAr: "التركيب في الموقع", nameEn: "On-site Installation", status: "completed" as const, seq: 3, done: -1 },
      ],
      materials: [
        { nameAr: "ألواح أكريليك", nameEn: "Acrylic Panels", unitAr: "لوح", unitEn: "panel", qty: 24, cost: 150 },
        { nameAr: "شاشات عرض 55 بوصة", nameEn: "55-inch Display Screens", unitAr: "قطعة", unitEn: "unit", qty: 8, cost: 1_800 },
      ],
    },
    {
      event: realEstateEvent,
      titleAr: "إنتاج معرض العقارات - الهوية البصرية",
      titleEn: "Real Estate Expo - Visual Identity Production",
      descriptionAr: "طباعة اللافتات والهوية البصرية لقاعة المعرض",
      descriptionEn: "Printing signage and visual identity for the exhibition hall",
      status: "pending" as const,
      due: daysFrom(now, 40),
      steps: [
        { nameAr: "اعتماد التصاميم من العميل", nameEn: "Client Design Approval", status: "pending" as const, seq: 1, done: null },
        { nameAr: "الطباعة الكبيرة", nameEn: "Large-format Printing", status: "pending" as const, seq: 2, done: null },
        { nameAr: "التركيب", nameEn: "Installation", status: "pending" as const, seq: 3, done: null },
      ],
      materials: [
        { nameAr: "بانرات فينيل", nameEn: "Vinyl Banners", unitAr: "متر مربع", unitEn: "sqm", qty: 200, cost: 45 },
        { nameAr: "إطارات ألمنيوم", nameEn: "Aluminum Frames", unitAr: "قطعة", unitEn: "unit", qty: 30, cost: 120 },
      ],
    },
  ];

  for (const p of productionSeeds) {
    const order = await prisma.productionOrder.create({
      data: {
        titleAr: p.titleAr,
        titleEn: p.titleEn,
        descriptionAr: p.descriptionAr,
        descriptionEn: p.descriptionEn,
        status: p.status,
        dueDate: p.due,
        eventId: p.event.id,
      },
    });

    for (const s of p.steps) {
      await prisma.productionStep.create({
        data: {
          nameAr: s.nameAr,
          nameEn: s.nameEn,
          status: s.status,
          sequence: s.seq,
          startDate: s.done !== null ? daysFrom(now, s.done - 3) : null,
          dueDate: daysFrom(now, s.seq * 3),
          completedAt: s.done !== null ? daysFrom(now, s.done) : null,
          notes: s.status === "in_progress" ? "جارٍ العمل عليها حاليًا / Currently in progress" : null,
          productionOrderId: order.id,
        },
      });
    }

    for (const m of p.materials) {
      await prisma.material.create({
        data: {
          nameAr: m.nameAr,
          nameEn: m.nameEn,
          unitAr: m.unitAr,
          unitEn: m.unitEn,
          quantity: m.qty,
          unitCost: sar(m.cost),
          supplierAr: "مؤسسة الخليج للتوريدات",
          supplierEn: "Gulf Supplies Establishment",
          productionOrderId: order.id,
        },
      });
    }
  }

  // -------------------------------------------------------------------------
  // Ticketing: ticket types, tickets, check-ins for KSU career fair (completed)
  // and stc summit (upcoming)
  // -------------------------------------------------------------------------
  const ticketTypeSeeds = [
    {
      event: ksuEvent,
      types: [
        { nameAr: "تذكرة طالب", nameEn: "Student Ticket", descAr: "دخول مجاني للطلاب بإثبات الهوية الجامعية", descEn: "Free entry for students with university ID", price: 0, qty: 500 },
        { nameAr: "تذكرة زائر عام", nameEn: "General Visitor Ticket", descAr: "دخول عام لمعرض التوظيف", descEn: "General admission to the career fair", price: 0, qty: 200 },
      ],
    },
    {
      event: stcEvent,
      types: [
        { nameAr: "تذكرة كاملة", nameEn: "Full Pass", descAr: "دخول لجميع الجلسات والفعاليات لمدة 3 أيام", descEn: "Access to all sessions and activities for 3 days", price: 1_200, qty: 300 },
        { nameAr: "تذكرة يومية", nameEn: "Day Pass", descAr: "دخول ليوم واحد فقط", descEn: "Single-day access only", price: 500, qty: 400 },
        { nameAr: "تذكرة VIP", nameEn: "VIP Pass", descAr: "دخول كامل مع جلسات VIP وموقف خاص", descEn: "Full access with VIP lounge sessions and dedicated parking", price: 3_000, qty: 50 },
      ],
    },
  ];

  const sampleAttendees = [
    { nameAr: "محمد العتيبي", nameEn: "Mohammed Al-Otaibi", email: "m.otaibi@example.com", phone: "+966502220001" },
    { nameAr: "عبير القحطاني", nameEn: "Abeer Al-Qahtani", email: "a.qahtani@example.com", phone: "+966502220002" },
    { nameAr: "سعود المالكي", nameEn: "Saud Al-Malki", email: "s.malki@example.com", phone: "+966502220003" },
    { nameAr: "هيفاء الزهراني", nameEn: "Haifa Al-Zahrani", email: "h.zahrani@example.com", phone: "+966502220004" },
    { nameAr: "بندر الشهري", nameEn: "Bandar Al-Shehri", email: "b.shehri@example.com", phone: "+966502220005" },
    { nameAr: "ريما العنزي", nameEn: "Reema Al-Anzi", email: "r.anzi@example.com", phone: "+966502220006" },
  ];

  let attendeeIdx = 0;
  for (const tt of ticketTypeSeeds) {
    for (const t of tt.types) {
      const ticketType = await prisma.ticketType.create({
        data: {
          nameAr: t.nameAr,
          nameEn: t.nameEn,
          descriptionAr: t.descAr,
          descriptionEn: t.descEn,
          price: sar(t.price),
          quantity: t.qty,
          eventId: tt.event.id,
        },
      });

      // Issue 2 sample tickets per ticket type
      for (let i = 0; i < 2; i++) {
        const attendee = sampleAttendees[attendeeIdx % sampleAttendees.length];
        attendeeIdx++;
        const isKsu = tt.event.id === ksuEvent.id;
        const ticket = await prisma.ticket.create({
          data: {
            code: `TCK-${tt.event.id.slice(-4).toUpperCase()}-${ticketType.id.slice(-4).toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
            holderName: `${attendee.nameAr} / ${attendee.nameEn}`,
            holderEmail: attendee.email,
            holderPhone: attendee.phone,
            status: isKsu ? "paid" : i === 0 ? "paid" : "reserved",
            ticketTypeId: ticketType.id,
          },
        });

        // Check in attendees for the completed KSU event, and the first ticket of the stc event
        if (isKsu || (tt.event.id === stcEvent.id && i === 0)) {
          await prisma.checkIn.create({
            data: {
              ticketId: ticket.id,
              checkedInAt: isKsu ? daysFrom(now, -4) : daysFrom(now, 14),
              scannedById: opsCoordinator.id,
            },
          });
        }
      }
    }
  }

  // -------------------------------------------------------------------------
  // Invoices, payments, installments, documents
  // -------------------------------------------------------------------------

  // Invoice 1: stc event - fully paid via single payment
  const invoice1Subtotal = sar(980_000);
  const invoice1Tax = Math.round(invoice1Subtotal * 0.15);
  const invoice1 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0001",
      status: "paid",
      subtotal: invoice1Subtotal,
      taxAmount: invoice1Tax,
      totalAmount: invoice1Subtotal + invoice1Tax,
      issueDate: daysFrom(now, -20),
      dueDate: daysFrom(now, -5),
      notes: "دفعة كاملة لمؤتمر stc للابتكار / Full payment for stc Innovation Summit",
      clientId: clients[wonIndexes[0]].id,
      eventId: stcEvent.id,
    },
  });
  await prisma.payment.create({
    data: {
      amount: invoice1.totalAmount,
      method: "bank_transfer",
      status: "completed",
      reference: "TRX-882190",
      paidAt: daysFrom(now, -6),
      notes: "تم استلام التحويل البنكي بالكامل / Full bank transfer received",
      invoiceId: invoice1.id,
      recordedById: accountManager.id,
    },
  });

  // Invoice 2: KSU career fair - completed, paid
  const invoice2Subtotal = sar(320_000);
  const invoice2Tax = Math.round(invoice2Subtotal * 0.15);
  const invoice2 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0002",
      status: "paid",
      subtotal: invoice2Subtotal,
      taxAmount: invoice2Tax,
      totalAmount: invoice2Subtotal + invoice2Tax,
      issueDate: daysFrom(now, -15),
      dueDate: daysFrom(now, -2),
      notes: "فاتورة معرض التوظيف بجامعة الملك سعود / Invoice for KSU Career Fair",
      clientId: clients[wonIndexes[1]].id,
      eventId: ksuEvent.id,
    },
  });
  await prisma.payment.create({
    data: {
      amount: invoice2.totalAmount,
      method: "cash",
      status: "completed",
      reference: "RCPT-55321",
      paidAt: daysFrom(now, -3),
      notes: "دفعة نقدية عند التسليم / Cash payment on delivery",
      invoiceId: invoice2.id,
      recordedById: accountManager.id,
    },
  });

  // Invoice 3: Jarir tech showcase - partially paid via installments (one overdue)
  const invoice3Subtotal = sar(540_000);
  const invoice3Tax = Math.round(invoice3Subtotal * 0.15);
  const invoice3Total = invoice3Subtotal + invoice3Tax;
  const invoice3 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0003",
      status: "partially_paid",
      subtotal: invoice3Subtotal,
      taxAmount: invoice3Tax,
      totalAmount: invoice3Total,
      issueDate: daysFrom(now, -10),
      dueDate: daysFrom(now, 30),
      notes: "دفع على ثلاث دفعات / Paid in three installments",
      clientId: clients[wonIndexes[2]].id,
      eventId: jarirEvent.id,
    },
  });
  const invoice3InstallmentAmount = Math.floor(invoice3Total / 3);
  const installment1 = await prisma.installment.create({
    data: {
      amount: invoice3InstallmentAmount,
      dueDate: daysFrom(now, -20),
      status: "paid",
      invoiceId: invoice3.id,
    },
  });
  const installment2 = await prisma.installment.create({
    data: {
      amount: invoice3InstallmentAmount,
      dueDate: daysFrom(now, -2),
      status: "overdue",
      invoiceId: invoice3.id,
    },
  });
  const installment3 = await prisma.installment.create({
    data: {
      amount: invoice3Total - invoice3InstallmentAmount * 2,
      dueDate: daysFrom(now, 28),
      status: "pending",
      invoiceId: invoice3.id,
    },
  });
  await prisma.payment.create({
    data: {
      amount: installment1.amount,
      method: "bank_transfer",
      status: "completed",
      reference: "TRX-882201",
      paidAt: daysFrom(now, -19),
      invoiceId: invoice3.id,
      installmentId: installment1.id,
      recordedById: accountManager.id,
    },
  });

  // Invoice 4: Real estate expo - sent, awaiting deposit (booth bookings)
  const invoice4Subtotal = sar(60_000); // 18000 + 17000 + 25000 booth prices
  const invoice4Tax = Math.round(invoice4Subtotal * 0.15);
  const invoice4 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0004",
      status: "sent",
      subtotal: invoice4Subtotal,
      taxAmount: invoice4Tax,
      totalAmount: invoice4Subtotal + invoice4Tax,
      issueDate: daysFrom(now, -2),
      dueDate: daysFrom(now, 25),
      notes: "فاتورة حجوزات الأجنحة لمعرض العقارات / Booth booking invoice for the real estate expo",
      clientId: clients[0].id,
      eventId: realEstateEvent.id,
    },
  });
  await prisma.installment.create({
    data: {
      amount: Math.round((invoice4Subtotal + invoice4Tax) / 2),
      dueDate: daysFrom(now, 5),
      status: "pending",
      invoiceId: invoice4.id,
    },
  });
  await prisma.installment.create({
    data: {
      amount: (invoice4Subtotal + invoice4Tax) - Math.round((invoice4Subtotal + invoice4Tax) / 2),
      dueDate: daysFrom(now, 25),
      status: "pending",
      invoiceId: invoice4.id,
    },
  });

  // Invoice 5: King Salman Park - draft, overdue example with no payments
  const invoice5Subtotal = sar(1_250_000);
  const invoice5Tax = Math.round(invoice5Subtotal * 0.15);
  const invoice5 = await prisma.invoice.create({
    data: {
      number: "INV-2026-0005",
      status: "overdue",
      subtotal: invoice5Subtotal,
      taxAmount: invoice5Tax,
      totalAmount: invoice5Subtotal + invoice5Tax,
      issueDate: daysFrom(now, -45),
      dueDate: daysFrom(now, -10),
      notes: "بانتظار اعتماد الدفعة من الجهة الحكومية / Awaiting government approval for payment",
      clientId: clients[3].id,
      eventId: kingSalmanEvent.id,
    },
  });
  await prisma.installment.create({
    data: {
      amount: invoice5.totalAmount,
      dueDate: daysFrom(now, -10),
      status: "overdue",
      invoiceId: invoice5.id,
    },
  });

  // -------------------------------------------------------------------------
  // Documents
  // -------------------------------------------------------------------------
  const documentSeeds: Array<{
    type: "contract" | "invoice" | "receipt" | "design" | "permit" | "other";
    titleAr: string;
    titleEn: string;
    fileUrl: string;
    mimeType: string;
    sizeBytes: number;
    clientId?: string;
    eventId?: string;
    invoiceId?: string;
    uploadedById: string;
  }> = [
    {
      type: "contract",
      titleAr: "عقد تنظيم مؤتمر stc للابتكار",
      titleEn: "stc Innovation Summit Service Contract",
      fileUrl: "/documents/contracts/stc-innovation-summit-2026.pdf",
      mimeType: "application/pdf",
      sizeBytes: 482_300,
      clientId: clients[wonIndexes[0]].id,
      eventId: stcEvent.id,
      uploadedById: accountManager.id,
    },
    {
      type: "invoice",
      titleAr: "فاتورة مؤتمر stc للابتكار",
      titleEn: "stc Innovation Summit Invoice",
      fileUrl: "/documents/invoices/INV-2026-0001.pdf",
      mimeType: "application/pdf",
      sizeBytes: 98_120,
      clientId: clients[wonIndexes[0]].id,
      eventId: stcEvent.id,
      invoiceId: invoice1.id,
      uploadedById: accountManager.id,
    },
    {
      type: "receipt",
      titleAr: "إيصال استلام دفعة معرض التوظيف",
      titleEn: "KSU Career Fair Payment Receipt",
      fileUrl: "/documents/receipts/RCPT-55321.pdf",
      mimeType: "application/pdf",
      sizeBytes: 54_800,
      clientId: clients[wonIndexes[1]].id,
      eventId: ksuEvent.id,
      invoiceId: invoice2.id,
      uploadedById: accountManager.id,
    },
    {
      type: "design",
      titleAr: "تصميم المسرح الرئيسي - النسخة 3",
      titleEn: "Main Stage Design - v3",
      fileUrl: "/documents/designs/stc-main-stage-v3.pdf",
      mimeType: "application/pdf",
      sizeBytes: 3_245_000,
      eventId: stcEvent.id,
      uploadedById: productionLead.id,
    },
    {
      type: "design",
      titleAr: "مخطط أجنحة معرض جرير",
      titleEn: "Jarir Showcase Booth Layout",
      fileUrl: "/documents/designs/jarir-booth-layout.dwg",
      mimeType: "application/acad",
      sizeBytes: 1_120_400,
      eventId: jarirEvent.id,
      uploadedById: productionLead.id,
    },
    {
      type: "permit",
      titleAr: "تصريح إقامة فعالية - أمانة منطقة الرياض",
      titleEn: "Event Permit - Riyadh Municipality",
      fileUrl: "/documents/permits/riyadh-municipality-stc-2026.pdf",
      mimeType: "application/pdf",
      sizeBytes: 215_600,
      eventId: stcEvent.id,
      uploadedById: opsCoordinator.id,
    },
    {
      type: "permit",
      titleAr: "تصريح فعالية محمية الملك سلمان",
      titleEn: "King Salman Park Event Permit",
      fileUrl: "/documents/permits/king-salman-park-permit.pdf",
      mimeType: "application/pdf",
      sizeBytes: 187_900,
      clientId: clients[3].id,
      eventId: kingSalmanEvent.id,
      uploadedById: opsCoordinator.id,
    },
    {
      type: "other",
      titleAr: "نسخة هوية تجارية - بنك الجزيرة",
      titleEn: "Brand Guidelines - Bank Aljazira",
      fileUrl: "/documents/other/bank-aljazira-brand-guidelines.pdf",
      mimeType: "application/pdf",
      sizeBytes: 5_640_000,
      clientId: clients[1].id,
      uploadedById: salesLead.id,
    },
  ];

  for (const d of documentSeeds) {
    await prisma.document.create({
      data: {
        type: d.type,
        titleAr: d.titleAr,
        titleEn: d.titleEn,
        fileUrl: d.fileUrl,
        mimeType: d.mimeType,
        sizeBytes: d.sizeBytes,
        clientId: d.clientId,
        eventId: d.eventId,
        invoiceId: d.invoiceId,
        uploadedById: d.uploadedById,
      },
    });
  }

  console.log("Seed completed successfully.");
  console.log(`  Users:        ${staffUsers.length + portalUsersData.length}`);
  console.log(`  Clients:      ${clients.length}`);
  console.log(`  Opportunities: ${opportunities.length}`);
  console.log(`  Events:       ${events.length}`);
  console.log(`  Booths:       ${Object.keys(boothMap).length}`);
  console.log(`  BoothBookings: ${boothBookings.length}`);
  console.log(`  Invoices:     5`);
  console.log(`  Documents:    ${documentSeeds.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
