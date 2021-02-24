import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeekdayTemplatesRepository } from './weekday-templates.repository';
import { WeekdayTemplateRepository } from './template/weekday-template.repository';
import { WeekdayTemplateCountersRepository } from './counters/weekday-template-counters.repository';


@NgModule({
	imports: [
		CommonModule
	],
	providers: [
		WeekdayTemplatesRepository,
		WeekdayTemplateRepository,
		WeekdayTemplateCountersRepository
	]
})
export class WeekdayTemplatesModule {

}
