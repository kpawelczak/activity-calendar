import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCalendarModule } from './calendar/activity-calendar.module';
import { SelectedDayModule } from './selected-day/selected-day.module';
import { CalendarFirebaseModule } from '../firebase/activities/calendar-firebase.module';
import { ClientRootComponent } from './client-root.component';
import { ClientRoutingModule } from './client-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { FirebaseEntryModule } from '../firebase/entry/firebase-entry.module';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		ActivityCalendarModule,
		SelectedDayModule,
		CalendarFirebaseModule,
		MatButtonModule,
		FirebaseEntryModule
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
