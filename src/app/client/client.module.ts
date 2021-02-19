import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRootComponent } from './client-root.component';
import { ClientRoutingModule } from './client-routing.module';
import { HeaderModule } from './shell/header.module';
import { HomeModule } from './home/home.module';
import { TemplatesModule } from './templates/templates.module';
import { WeekdayTemplatesModule } from '../repositories/templates/weekday-templates.module';
import { MonthActivitiesModule } from '../repositories/activities/month-activities.module';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		HomeModule,
		TemplatesModule,
		HeaderModule,
		WeekdayTemplatesModule,
		MonthActivitiesModule
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
