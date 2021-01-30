import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCalendarComponent } from './activity-calendar.component';
import { ActivityCalendarTopInterfaceComponent } from './components/top-interface/activity-calendar-top-interface.component';
import { ActivityCalendarYearsComponent } from './components/years/activity-calendar-years.component';
import { ActivityCalendarMonthsComponent } from './components/months/activity-calendar-months.component';
import { ActivityCalendarDaysComponent } from './components/days/activity-calendar-days.component';
import { ActiveDateService } from './active-date.service';
import { ActivityCalendarService } from './activity-calendar.service';
import { ActivityCalendarViewService } from './activity-calendar-view.service';
import { ActivityCalendarYearsService } from './components/years/activity-calendar-years.service';
import { ActivityCalendarWeeks } from './components/weeks/activity-calendar.weeks';
import { ActivityCalendarYears } from './components/years/activity-calendar.years';
import { FabricArrowIconModule } from '../common/icons/arrow-icon/fabric-arrow-icon.module';
import { FabricDateUtilModule } from '../common/date-util/fabric-date-util.module';
import { ActivityCalendarDaysContainerComponent } from './components/days/activity-calendar-days-container.component';


@NgModule({
	imports: [
		CommonModule,
		FabricArrowIconModule,
		FabricDateUtilModule
	],
	declarations: [
		ActivityCalendarComponent,
		ActivityCalendarDaysComponent,
		ActivityCalendarDaysContainerComponent,
		ActivityCalendarMonthsComponent,
		ActivityCalendarYearsComponent,
		ActivityCalendarTopInterfaceComponent
	],
	exports: [
		ActivityCalendarComponent
	],
	providers: [
		ActiveDateService,
		ActivityCalendarService,
		ActivityCalendarViewService,
		ActivityCalendarYearsService,
		ActivityCalendarWeeks,
		ActivityCalendarYears
	]
})
export class ActivityCalendarModule {

}
