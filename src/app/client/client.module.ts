import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCalendarModule } from './calendar/activity-calendar.module';
import { SelectedDayModule } from './selected-day/selected-day.module';
import { CalendarFirebaseModule } from '../firebase/activities/calendar-firebase.module';
import { ClientRootComponent } from './client-root.component';
import { ClientRoutingModule } from './client-routing.module';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		ActivityCalendarModule,
		SelectedDayModule,
		CalendarFirebaseModule
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
