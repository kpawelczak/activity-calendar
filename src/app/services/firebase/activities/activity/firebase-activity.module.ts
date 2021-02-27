import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseActivityService } from './firebase-activity.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirebaseActivityService
	]
})
export class FirebaseActivityModule {

}
