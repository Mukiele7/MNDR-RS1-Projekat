import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customPhone',
  standalone: true
})
export class CustomPhonePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    if (!value) return '';

    const cleaned = value.replace(/\D/g, '');

    if (cleaned.length === 9 && cleaned.startsWith('6')) {
      return `0${cleaned.substring(0, 2)}-${cleaned.substring(2, 5)}-${cleaned.substring(5)}`;
    }

    if (cleaned.length === 10 && cleaned.startsWith('0')) {
      return `${cleaned.substring(0, 3)}-${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
    }

    return value;
  }
}
