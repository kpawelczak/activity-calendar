import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreMonthActivitiesRepository } from './firestore-month-activities.repository';
import { FirestoreMonthActivitiesService } from './firestore-month-activities.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirestoreMonthActivitiesRepository,
		FirestoreMonthActivitiesService
	]
})
export class FirestoreMonthActivitiesModule {

}
