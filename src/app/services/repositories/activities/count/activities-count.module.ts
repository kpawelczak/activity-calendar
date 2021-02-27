import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivitiesCountRepository } from './activities-count.repository';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		ActivitiesCountRepository
	]
})
export class ActivitiesCountModule {

}
