import {Injectable} from '@angular/core';
import * as momentNs from 'jalali-moment';
import {Moment} from 'jalali-moment';

import {UtilsService} from '../common/services/utils/utils.service';
import {DayCalendarService} from '../day-calendar/day-calendar.service';
import {IDayTimeCalendarConfig} from './day-time-calendar-config.model';
const moment = momentNs;

const DAY_FORMAT = 'YYYYMMDD';
const TIME_FORMAT = 'HH:mm:ss';
const COMBINED_FORMAT = DAY_FORMAT + TIME_FORMAT;

@Injectable()
export class DayTimeCalendarService {
  readonly DEFAULT_CONFIG: IDayTimeCalendarConfig = {
    locale: 'fa'
  };

  constructor(private utilsService: UtilsService,
              private dayCalendarService: DayCalendarService) {
  }

  getConfig(config: IDayTimeCalendarConfig): IDayTimeCalendarConfig {
    const _config = {
      ...this.DEFAULT_CONFIG,
      ...this.dayCalendarService.getConfig(config)
    };

    // moment.locale(config.locale);

    return _config;
  }

  updateDay(current: Moment, day: Moment, config: IDayTimeCalendarConfig): Moment {
    const time = current ? current : moment();
    let updated = moment.from(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), day.locale(), COMBINED_FORMAT)

    if (config.min) {
      const min = <Moment>config.min;
      updated = min.isAfter(updated) ? min : updated;
    }

    if (config.max) {
      const max = <Moment>config.max;
      updated = max.isBefore(updated) ? max : updated;
    }

    return updated;
  }

  updateTime(current: Moment, time: Moment): Moment {
    const day = current ? current : moment();

    return moment.from(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), day.locale(), COMBINED_FORMAT);
  }
}
