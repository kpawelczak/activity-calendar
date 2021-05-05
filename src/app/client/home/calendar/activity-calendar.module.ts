import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FirebaseActivitiesModule } from '../../../services/firebase/activities/activities/firebase-activities.module';
import { FirebaseActivitiesCountModule } from '../../../services/firebase/activities/activities-count/firebase-activities-count.module';

import { FabricArrowIconModule } from '../../../common/icons/arrow-icon/fabric-arrow-icon.module';
import { FabricDateUtilModule } from '../../../common/utils/date-util/fabric-date-util.module';

import { ActivityCalendarComponent } from './activity-calendar.component';
import { ActivityCalendarViewPanelComponent } from './view/activity-calendar-view-panel.component';
import { ActivityCalendarYearsViewComponent } from './view/years/activity-calendar-years-view.component';
import { ActivityCalendarMonthsViewComponent } from './view/months/activity-calendar-months-view.component';
import { ActivityCalendarDaysComponent } from './view/days/activity-calendar-days.component';
import { ActivityCalendarDaysViewComponent } from './view/days/activity-calendar-days-view.component';

import { ActivityCalendarCardViewService } from './view/activity-calendar-card-view.service';
import { ActiveDateService } from './active-date.service';
import { ActivityCalendarService } from './activity-calendar.service';
import { ActivityCalendarViewService } from './activity-calendar-view.service';
import { ActivityCalendarYearsService } from './services/activity-calendar-years.service';
import { ActivityCalendarWeeks } from './services/activity-calendar.weeks';
import { ActivityCalendarYears } from './services/activity-calendar.years';

@NgModule({
	imports: [
		CommonModule,
		FabricArrowIconModule,
		FabricDateUtilModule,
		FirebaseActivitiesModule,
		FirebaseActivitiesCountModule
	],
	declarations: [
		ActivityCalendarComponent,
		ActivityCalendarDaysComponent,
		ActivityCalendarDaysViewComponent,
		ActivityCalendarMonthsViewComponent,
		ActivityCalendarYearsViewComponent,
		ActivityCalendarViewPanelComponent
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
		ActivityCalendarYears,
		ActivityCalendarCardViewService
	]
})
export class ActivityCalendarModule {

}
