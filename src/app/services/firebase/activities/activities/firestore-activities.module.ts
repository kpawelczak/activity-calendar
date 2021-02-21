import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreActivitiesService } from './firestore-activities.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirestoreActivitiesService
	]
})
export class FirestoreActivitiesModule {

}
