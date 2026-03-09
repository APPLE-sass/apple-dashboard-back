// src/imei/pipes/luhn-validation.pipe.ts
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  UnprocessableEntityException,
} from '@nestjs/common';

/**
 * Validates that the incoming value passes the Luhn (mod-10) checksum algorithm.
 *
 * This pipe is meant to be applied AFTER class-validator has already ensured
 * the value is a 15-digit numeric string (via ProcessImeiDto).
 *
 * Algorithm steps:
 *  1. Starting from the rightmost digit (check digit), double every second digit
 *     moving left (i.e. digits at odd positions from the right, 0-indexed).
 *  2. If doubling produces a value > 9, subtract 9.
 *  3. Sum all digits.
 *  4. A valid IMEI produces a sum divisible by 10.
 */
@Injectable()
export class LuhnValidationPipe implements PipeTransform<string, string> {
  transform(value: string, _metadata: ArgumentMetadata): string {
    if (!this.passesLuhn(value)) {
      throw new UnprocessableEntityException(
        `El IMEI "${value}" no supera la validación del algoritmo de Luhn. Verifique el número e intente nuevamente.`,
      );
    }
    return value;
  }

  /**
   * Returns true if the numeric string passes the Luhn checksum.
   */
  private passesLuhn(imei: string): boolean {
    let sum = 0;
    let shouldDouble = false;

    // Traverse from rightmost digit to leftmost
    for (let i = imei.length - 1; i >= 0; i--) {
      let digit = parseInt(imei.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }
}