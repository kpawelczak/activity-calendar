import { TemplatesComponent } from '../../templates/feature/templates.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

const routes = [{
	path: '',
	component: TemplatesComponent
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
export class ClientTemplatesRoutingModule {

}
