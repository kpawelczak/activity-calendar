import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientRootComponent } from './client-root.component';
import { ClientRoutingModule } from './client-routing.module';
import { HeaderModule } from './shell/header.module';
import { ClientHomeModule } from './home/client-home.module';
import { TemplatesModule } from '../templates/templates.module';
import { ActivitiesModule } from '../activities/activities.module';
import { ClientTemplatesModule } from './templates/client-templates.module';
import { ActivitiesConfigModule } from '../activities-config/activities-config.module';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		HeaderModule,

		ClientHomeModule,
		ClientTemplatesModule,

		ActivitiesConfigModule.forRoot(),
		ActivitiesModule.forRoot(),
		TemplatesModule.forRoot()
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
