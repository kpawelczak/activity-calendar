import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseActivitiesService } from './firebase-activities.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirebaseActivitiesService
	]
})
export class FirebaseActivitiesModule {

}
