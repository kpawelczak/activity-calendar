import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientRootComponent } from './client-root.component';
import { RouteNames } from '../route-names';
import { TemplatesComponent } from './templates/templates.component';
import { HomeRootComponent } from './home/home-root.component';

const routes = [{
	path: '',
	component: ClientRootComponent,
	children: [
		{
			path: '',
			component: HomeRootComponent
		}, {
			path: RouteNames.TEMPLATES,
			component: TemplatesComponent
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

