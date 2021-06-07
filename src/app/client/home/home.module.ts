import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { ActivityCalendarModule } from './calendar/activity-calendar.module';
import { SelectedDayModule } from './selected-day/selected-day.module';

@NgModule({
	imports: [
		CommonModule,
		ActivityCalendarModule,
		SelectedDayModule
	],
	declarations: [
		HomeComponent
	]
})
export class HomeModule {

}
