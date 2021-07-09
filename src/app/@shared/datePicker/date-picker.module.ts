import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DomHelper} from './common/services/dom-appender/dom-appender.service';
import {UtilsService} from './common/services/utils/utils.service';
import {DatePickerComponent} from './date-picker/date-picker.component';
import {DatePickerDirective} from './date-picker/date-picker.directive';
import {DayCalendarComponent} from './day-calendar/day-calendar.component';
import {MonthCalendarComponent} from './month-calendar/month-calendar.component';
import {CalendarNavComponent} from './calendar-nav/calendar-nav.component';
import {DayTimeCalendarComponent} from './day-time-calendar/day-time-calendar.component';
import { SharedModule } from '../shared.module';
export {DatePickerComponent} from './date-picker/date-picker.component';
export {DatePickerDirective} from './date-picker/date-picker.directive';
export {DayCalendarComponent} from './day-calendar/day-calendar.component';
export {DayTimeCalendarComponent} from './day-time-calendar/day-time-calendar.component';
export {MonthCalendarComponent} from './month-calendar/month-calendar.component';

@NgModule({
  providers: [
    DomHelper,
    UtilsService
  ],
  declarations: [
    DatePickerComponent,
    DatePickerDirective,
    DayCalendarComponent,
    MonthCalendarComponent,
    CalendarNavComponent,
    DayTimeCalendarComponent
  ],
  entryComponents: [
    DatePickerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    DatePickerComponent,
    DatePickerDirective,
    MonthCalendarComponent,
    DayCalendarComponent,
    DayTimeCalendarComponent
  ]
})
export class DpDatePickerModule {
}
