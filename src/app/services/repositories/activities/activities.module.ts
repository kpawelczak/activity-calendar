import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesRepository } from './activities.repository';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		ActivitiesRepository
	]
})
export class ActivitiesModule {

}
