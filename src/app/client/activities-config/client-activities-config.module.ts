import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientActivitiesConfigRoutingModule } from './client-activities-config-routing.module';
import { ActivitiesConfigModule } from '../../activities-config/activities-config.module';

import { ClientActivitiesConfigRootComponent } from './client-activities-config-root.component';

@NgModule({
	imports: [
		CommonModule,
		ActivitiesConfigModule.forFeature(),
		ClientActivitiesConfigRoutingModule
	],
	declarations: [
		ClientActivitiesConfigRootComponent
	]
})
export class ClientActivitiesConfigModule {

}
