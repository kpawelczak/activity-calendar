import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientHomeComponent } from './client-home.component';
import { ActivityCalendarModule } from '../../calendar/activity-calendar.module';
import { ActivitiesModule } from '../../activities/activities.module';
import { ClientHomeRoutingModule } from './client-home-routing.module';

@NgModule({
	imports: [
		CommonModule,
		ClientHomeRoutingModule,
		ActivitiesModule.forFeature(),
		ActivityCalendarModule
	],
	declarations: [
		ClientHomeComponent
	]
})
export class ClientHomeModule {

}
