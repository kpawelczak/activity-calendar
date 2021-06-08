import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeekdayTemplate } from '../weekday-template';
import { FirebaseTemplatesService } from '../../infrastructure/firebase-templates.service';
import { SmartRepository } from '../../../common/cdk/smart-repository';


@Injectable()
export class TemplatesRepository extends SmartRepository<Array<WeekdayTemplate>> {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService) {
		super();
	}

	getValuesFromApi(): Observable<Array<WeekdayTemplate>> {
		this.requested = true;
		return this.firebaseTemplatesService
				   .loadTemplates();
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
