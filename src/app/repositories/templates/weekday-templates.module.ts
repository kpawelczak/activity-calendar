import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekdayTemplatesRepository } from './weekday-templates.repository';


@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		WeekdayTemplatesRepository
	]
})
export class WeekdayTemplatesModule {

}
