import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesModule } from '../../templates/templates.module';
import { ClientTemplatesRoutingModule } from './client-templates-routing.module';

@NgModule({
	imports: [
		CommonModule,
		ClientTemplatesRoutingModule,
		TemplatesModule.forFeature()
	]
})
export class ClientTemplatesModule {

}
