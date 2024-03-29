import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { HeaderModule } from './shell/header.module';
import { ClientHomeModule } from './home/client-home.module';
import { TemplatesModule } from '../../core/templates/templates.module';
import { ActivitiesModule } from '../../core/activities/activities.module';
import { ClientTemplatesModule } from './templates/client-templates.module';
import { ActivitiesConfigModule } from '../../core/activities-config/activities-config.module';
import { DomainChangesModule } from '../../core/domain/changes/domain-changes.module';

import { ClientRootComponent } from './client-root.component';


@NgModule({
	imports: [
		CommonModule,
		ClientRoutingModule,
		HeaderModule,

		ClientHomeModule,
		ClientTemplatesModule,

		ActivitiesConfigModule.forRoot(),
		ActivitiesModule.forRoot(),
		TemplatesModule.forRoot(),
		DomainChangesModule.forRoot()
	],
	declarations: [
		ClientRootComponent
	]
})
export class ClientModule {

}
