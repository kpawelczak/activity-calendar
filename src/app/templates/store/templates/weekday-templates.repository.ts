import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeekdayTemplate } from '../template/weekday-template';
import { weekdayTemplates } from './weekday-templates';
import { map, switchMap } from 'rxjs/operators';
import { TemplateCounter } from '../counters/template-counter';
import { WeekdayTemplateCountersRepository } from '../counters/weekday-template-counters.repository';

@Injectable()
export class WeekdayTemplatesRepository {

	private templates: Array<WeekdayTemplate> = weekdayTemplates;

	private weekdayTemplateCounters: TemplateCounter;

	private readonly templates$ = new BehaviorSubject<Array<WeekdayTemplate>>(this.templates);

	constructor(private readonly weekdayTemplatesCounterRepository: WeekdayTemplateCountersRepository) {
	}

	onTemplates(): Observable<Array<WeekdayTemplate>> {
		return this.weekdayTemplatesCounterRepository
				   .onValues()
				   .pipe(
					   switchMap((templateCounters: TemplateCounter) => {
						   this.weekdayTemplateCounters = templateCounters;
						   return this.templates$.asObservable();
					   }),
					   map((templates: Array<WeekdayTemplate>) => {
						   return templates.map((weekdayTemplate: WeekdayTemplate) => {
							   let templateCounter;

							   if (this.weekdayTemplateCounters) {
								   const weekday = weekdayTemplate.weekday,
									   templateCounterValue = this.weekdayTemplateCounters[weekday];
								   templateCounter = templateCounterValue ? { [weekday]: templateCounterValue } : null;
							   }

							   return new WeekdayTemplate(weekdayTemplate.weekday, weekdayTemplate.templates, templateCounter);
						   });
					   })
				   );
	}

	next(weekdayTemplate: WeekdayTemplate): void {
		this.replaceWeekdayTemplate(weekdayTemplate);
		this.templates$.next(this.templates);
	}

	reset(): void {
		this.templates$.next(weekdayTemplates);
	}

	private replaceWeekdayTemplate(newTemplate: WeekdayTemplate): void {
		this.templates = this.templates.map((weekdayTemplate: WeekdayTemplate) => {
			return newTemplate.weekday === weekdayTemplate.weekday ? newTemplate : weekdayTemplate;
		});
	}
}
