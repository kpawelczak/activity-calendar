import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekdayTemplatesRepository } from './weekday-templates.repository';
import { WeekdayTemplateRepository } from './weekday-template.repository';


@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		WeekdayTemplatesRepository,
		WeekdayTemplateRepository
	]
})
export class WeekdayTemplatesModule {

}
