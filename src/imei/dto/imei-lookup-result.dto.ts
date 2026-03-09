// src/imei/dto/imei-lookup-result.dto.ts

/**
 * The response body returned to the caller of POST /imei/process.
 *
 * The backend only validates the IMEI and persists the scan log.
 * Device information (model, color, etc.) is resolved on the frontend
 * via @zxing/library and any device lookup the client chooses to perform.
 */
export interface ProcessImeiResponseDto {
  imei: string;
  scanId: string;
  scannedAt: Date;
}