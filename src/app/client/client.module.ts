import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRootComponent } from './client-root.component';
import { ClientRoutingModule } from './client-routing.module';
import { HeaderModule } from './shell/header.module';
import { HomeModule } from './home/home.module';
import { ActivitiesModule } from '../services/repositories/activities/activities.module';
import { ActivitiesCountModule } from '../services/repositories/activities/count/activities-count.module';
import { TemplatesModule } from '../templates/templates.module';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		HomeModule,
		TemplatesModule,
		HeaderModule,
		ActivitiesModule,
		ActivitiesCountModule
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
