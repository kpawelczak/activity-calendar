import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeekdayTemplate } from '../../../repositories/templates/weekday-template';
import { WeekdayTemplatesRepository } from '../../../repositories/templates/weekday-templates.repository';
import { map } from 'rxjs/operators';

@Injectable()
export class WeekdayTemplateRepository {

	constructor(private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository) {
	}

	onTemplate(requestedWeekday: string): Observable<WeekdayTemplate> {
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
