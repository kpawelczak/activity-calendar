import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientActivitiesConfigRootComponent } from './client-activities-config-root.component';

const routes = [{
	path: '',
	component: ClientActivitiesConfigRootComponent
}];


@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(routes)
	],
	exports: [
		RouterModule
	]
})
export class ClientActivitiesConfigRoutingModule {

}
