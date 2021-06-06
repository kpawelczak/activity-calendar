import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeekdayTemplate } from './weekday-template';
import { WeekdayTemplatesRepository } from '../templates/weekday-templates.repository';
import { map } from 'rxjs/operators';
import { Weekday } from '../weekday';
import { ValuesRepository } from '../../../common/cdk/values-repository';
import { FirebaseTemplateService } from '../../infrastructure/firebase-template.service';


@Injectable()
export class WeekdayTemplateRepository extends ValuesRepository<WeekdayTemplate> {

	constructor(private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
				private readonly firebaseTemplateService: FirebaseTemplateService) {
		super();
	}

	getTemplate(weekday: Weekday): void {
		this.firebaseTemplateService
			.loadTemplate(weekday)
			.pipe(this.takeUntil())
			.subscribe((weekdayTemplate: WeekdayTemplate) => {
				this.weekdayTemplatesRepository.next(weekdayTemplate);
			});
	}

	onTemplate(requestedWeekday: Weekday): Observable<WeekdayTemplate> {
		return this.weekdayTemplatesRepository
				   .onTemplates()
				   .pipe(
					   map((weekdayTemplates: Array<WeekdayTemplate>) => {
						   const requestedTemplateActivities
							   = weekdayTemplates
							   .filter((weekdayTemplate: WeekdayTemplate) => weekdayTemplate.weekday === requestedWeekday);

						   return requestedTemplateActivities[0];
					   })
				   );
	}

}
