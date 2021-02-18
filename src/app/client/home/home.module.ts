import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRootComponent } from './home-root.component';
import { ActivityCalendarModule } from './calendar/activity-calendar.module';
import { SelectedDayModule } from './selected-day/selected-day.module';

@NgModule({
	imports: [
		CommonModule,
		ActivityCalendarModule,
		SelectedDayModule
	],
	declarations: [
		HomeRootComponent
	]
})
export class HomeModule {

}
