import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClientTemplatesRootComponent } from './client-templates-root.component';

const routes = [{
	path: '',
	component: ClientTemplatesRootComponent
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
