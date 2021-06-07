import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientRootComponent } from './client-root.component';
import { RouteName } from '../route-name';
import { TemplatesComponent } from '../templates/feature/templates.component';
import { HomeComponent } from './home/home.component';

const routes = [{
	path: '',
	component: ClientRootComponent,
	children: [
		{
			path: '',
			component: HomeComponent
		}, {
			path: RouteName.TEMPLATES,
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

