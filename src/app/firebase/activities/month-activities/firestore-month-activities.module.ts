import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirestoreMonthActivitiesService } from './firestore-month-activities.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirestoreMonthActivitiesService
	]
})
export class FirestoreMonthActivitiesModule {

}
