import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { WeekdayTemplate } from './weekday-template';
import { weekdayTemplates } from './weekday-templates';

@Injectable()
export class WeekdayTemplatesRepository {

	private templates: Array<WeekdayTemplate> = weekdayTemplates;

	private readonly templates$ = new BehaviorSubject<Array<WeekdayTemplate>>(this.templates);

	onTemplates(): Observable<Array<WeekdayTemplate>> {
		return this.templates$.asObservable();
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
