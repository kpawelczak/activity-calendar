import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRootComponent } from './client-root.component';
import { ClientRoutingModule } from './client-routing.module';
import { HeaderModule } from './shell/header.module';
import { HomeModule } from './home/home.module';
import { TemplatesModule } from './templates/templates.module';
import { WeekdayTemplatesModule } from '../services/repositories/templates/weekday-templates.module';
import { ActivitiesModule } from '../services/repositories/activities/activities.module';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		HomeModule,
		TemplatesModule,
		HeaderModule,
		WeekdayTemplatesModule,
		ActivitiesModule
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
