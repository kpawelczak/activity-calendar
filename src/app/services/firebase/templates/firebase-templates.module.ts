import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseTemplatesService } from './firebase-templates.service';


@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirebaseTemplatesService
	]
})
export class FirebaseTemplatesModule {

}
