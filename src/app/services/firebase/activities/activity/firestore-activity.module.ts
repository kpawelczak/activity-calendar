import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreActivityService } from './firestore-activity.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirestoreActivityService
	]
})
export class FirestoreActivityModule {

}
