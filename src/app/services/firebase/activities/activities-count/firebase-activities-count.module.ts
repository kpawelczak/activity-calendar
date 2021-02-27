import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseActivitiesCountService } from './firebase-activities-count.service';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		FirebaseActivitiesCountService
	]
})
export class FirebaseActivitiesCountModule {

}
