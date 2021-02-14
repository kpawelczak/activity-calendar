import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityCalendarModule } from './calendar/activity-calendar.module';
import { SelectedDayModule } from './selected-day/selected-day.module';
import { ClientRootComponent } from './client-root.component';
import { ClientRoutingModule } from './client-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { HeaderModule } from './shell/header.module';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		ActivityCalendarModule,
		SelectedDayModule,
		HeaderModule,
		MatButtonModule
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
