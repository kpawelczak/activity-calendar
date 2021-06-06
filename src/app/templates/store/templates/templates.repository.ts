import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeekdayTemplate } from '../weekday-template';
import { FirebaseTemplatesService } from '../../infrastructure/firebase-templates.service';
import { SmartRepository } from '../../../common/cdk/smart-repository';
import { take } from 'rxjs/operators';

@Injectable()
export class TemplatesRepository extends SmartRepository<Array<WeekdayTemplate>> {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService) {
		super();
	}

	loadTemplates(): void {
		this.firebaseTemplatesService
			.loadTemplates()
			.pipe(this.takeUntil())
			.subscribe((weekdayTemplates: Array<WeekdayTemplate>) => {
				this.next(weekdayTemplates);
			});
	}

	getValuesFromApi(): Observable<Array<WeekdayTemplate>> {
		return this.firebaseTemplatesService
				   .loadTemplates()
				   .pipe(take(1));
	}

	nextTemplate(weekdayTemplate: WeekdayTemplate): void {
		const newTemplates = [...this.replaceWeekdayTemplate(weekdayTemplate)];
		this.next(newTemplates);
	}

	private replaceWeekdayTemplate(newTemplate: WeekdayTemplate): Array<WeekdayTemplate> {
		return this.getValues()
				   .map((weekdayTemplate: WeekdayTemplate) => {
					   return newTemplate.getWeekday() === weekdayTemplate.getWeekday() ? newTemplate : weekdayTemplate;
				   });
	}

}
