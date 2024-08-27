import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';

import { Mapper } from './mappers';

/** Date mapper. */
@Injectable({
  providedIn: 'root',
})
export class DateMapper implements Mapper<string, Date> {
  /** @inheritdoc */
  public fromDto(data: string): Date {
    const parsedDateFromISOString = DateTime.fromISO(data);
    return parsedDateFromISOString.toJSDate();
  }

  /** @inheritdoc */
  public toDto(data: Date, customFormat = 'yyyy-MM-dd'): string {
    return DateTime.fromJSDate(data).toFormat(customFormat);
  }
}
