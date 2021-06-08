import { NgModule } from '@angular/core';
import { RouteName } from '../route-name';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TemplatesRootComponent } from './templates-root.component';
import { TemplatesComponent } from './feature/templates/templates.component';
import { TemplatesSettingsComponent } from './feature/settings/templates-settings.component';

const routes = [{
	path: '',
	component: TemplatesRootComponent,
	children: [
		{
			path: RouteName.TEMPLATES,
			component: TemplatesComponent
		}, {
			path: RouteName.TEMPLATES_SETTINGS,
			component: TemplatesSettingsComponent
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
export class TemplatesRoutingModule {

}
