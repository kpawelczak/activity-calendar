import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreSelectedDayActivitiesService } from './firestore-selected-day-activities.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirestoreSelectedDayActivitiesService
	]
})
export class FirestoreSelectedDayActivitiesModule {

}
