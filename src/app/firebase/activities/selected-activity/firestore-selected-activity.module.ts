import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreSelectedActivityService } from './firestore-selected-activity.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirestoreSelectedActivityService
	]
})
export class FirestoreSelectedActivityModule {

}
