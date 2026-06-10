-- Replace BoothStatus enum: available/reserved/unavailable -> available/reserved/contracted/production/delivered
-- Existing 'unavailable' booths are remapped to 'available'.

CREATE TYPE "BoothStatus_new" AS ENUM ('available', 'reserved', 'contracted', 'production', 'delivered');

ALTER TABLE "Booth" ALTER COLUMN "status" DROP DEFAULT;

ALTER TABLE "Booth" ALTER COLUMN "status" TYPE "BoothStatus_new" USING (
  CASE "status"::text
    WHEN 'unavailable' THEN 'available'
    ELSE "status"::text
  END
)::"BoothStatus_new";

ALTER TABLE "Booth" ALTER COLUMN "status" SET DEFAULT 'available';

DROP TYPE "BoothStatus";
ALTER TYPE "BoothStatus_new" RENAME TO "BoothStatus";
