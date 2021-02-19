import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonthActivitiesRepository } from './month-activities.repository';

@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		MonthActivitiesRepository
	]
})
export class MonthActivitiesModule {

}
