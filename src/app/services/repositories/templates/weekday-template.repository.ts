import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeekdayTemplate } from './weekday-template';
import { WeekdayTemplatesRepository } from './weekday-templates.repository';
import { map } from 'rxjs/operators';
import { Weekday } from './weekday';

@Injectable()
export class WeekdayTemplateRepository {

	constructor(private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository) {
	}

	onTemplate(requestedWeekday: Weekday): Observable<WeekdayTemplate> {
		return this.weekdayTemplatesRepository
				   .onTemplates()
				   .pipe(
					   map((weekdayTemplates: Array<WeekdayTemplate>) => {
						   const requestedTemplateActivities = weekdayTemplates
							   .filter((weekdayTemplate: WeekdayTemplate) => weekdayTemplate.weekday === requestedWeekday);

						   return requestedTemplateActivities[0];
					   })
				   );
	}

}
