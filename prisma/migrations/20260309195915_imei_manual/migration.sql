-- CreateEnum
CREATE TYPE "ImeiScanStatus" AS ENUM ('SUCCESS', 'INVALID_IMEI');

-- CreateTable
CREATE TABLE "imei_scan_logs" (
    "id" TEXT NOT NULL,
    "imei" TEXT NOT NULL,
    "status" "ImeiScanStatus" NOT NULL DEFAULT 'SUCCESS',
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "imei_scan_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "imei_scan_logs_imei_idx" ON "imei_scan_logs"("imei");

-- CreateIndex
CREATE INDEX "imei_scan_logs_user_id_idx" ON "imei_scan_logs"("user_id");

-- CreateIndex
CREATE INDEX "imei_scan_logs_status_idx" ON "imei_scan_logs"("status");

-- CreateIndex
CREATE INDEX "imei_scan_logs_created_at_idx" ON "imei_scan_logs"("created_at");

-- AddForeignKey
ALTER TABLE "imei_scan_logs" ADD CONSTRAINT "imei_scan_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
