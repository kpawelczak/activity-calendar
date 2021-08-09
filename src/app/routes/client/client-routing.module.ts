import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientRootComponent } from './client-root.component';
import { RouteName } from '../../route-name';

const routes = [{
	path: '',
	component: ClientRootComponent,
	children: [
		{
			path: '',
			loadChildren: () => import('./home/client-home.module').then(m => m.ClientHomeModule)
		}, {
			path: RouteName.TEMPLATES,
			loadChildren: () => import('./templates/client-templates.module').then(m => m.ClientTemplatesModule)
		}, {
			path: RouteName.ACTIVITIES_SETTINGS,
			loadChildren: () => import('./activities-config/client-activities-config.module').then(m => m.ClientActivitiesConfigModule)
		}
	]
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
export class ClientRoutingModule {

}

