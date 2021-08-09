import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesModule } from '../../../core/templates/templates.module';
import { ClientTemplatesRoutingModule } from './client-templates-routing.module';

import { ClientTemplatesRootComponent } from './client-templates-root.component';

@NgModule({
	imports: [
		CommonModule,
		ClientTemplatesRoutingModule,
		TemplatesModule.forFeature()
	],
	declarations: [
		ClientTemplatesRootComponent
	]
})
export class ClientTemplatesModule {

}
