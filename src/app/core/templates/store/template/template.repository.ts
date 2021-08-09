import { Injectable } from '@angular/core';
import { WeekdayTemplate } from '../weekday-template';
import { Observable } from 'rxjs';
import { TemplatesRepository } from '../templates/templates.repository';
import { Weekday } from '../../weekday';
import { filter, map } from 'rxjs/operators';


@Injectable()
export class TemplateRepository {

	constructor(private readonly templatesRepository: TemplatesRepository) {

	}

	onWeekdayTemplate(weekday: Weekday): Observable<WeekdayTemplate> {
		return this.templatesRepository
				   .onValues()
				   .pipe(
					   map((weekdayTemplates: Array<WeekdayTemplate>) => {
						   const requestedTemplateActivities
							   = weekdayTemplates
							   ?.filter((weekdayTemplate: WeekdayTemplate) => weekdayTemplate.getWeekday() === weekday)[0];
						   return requestedTemplateActivities;
					   }),
					   filter((weekdayTemplate: WeekdayTemplate) => !!weekdayTemplate)
				   );
	}
}
