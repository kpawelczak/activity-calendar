import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseTemplatesService } from './firebase-templates.service';
import { FirebaseTemplateCountersService } from './firebase-template-counters.service';


@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirebaseTemplatesService,
		FirebaseTemplateCountersService
	]
})
export class FirebaseTemplatesModule {

}
