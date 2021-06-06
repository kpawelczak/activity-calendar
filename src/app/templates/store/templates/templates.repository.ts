import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeekdayTemplate } from '../weekday-template';
import { weekdayTemplates } from '../weekday-templates';
import { FirebaseTemplatesService } from '../../infrastructure/firebase-templates.service';
import { map } from 'rxjs/operators';
import { Weekday } from '../../weekday';
import { TemplateActivity } from '../../template-activity';
import { SmartRepository } from '../../../common/cdk/smart-repository';

@Injectable()
export class TemplatesRepository extends SmartRepository<Array<WeekdayTemplate>> {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService) {
		super();
	}

	getValuesFromApi(): Observable<Array<WeekdayTemplate>> {
		return this.firebaseTemplatesService
				   .loadTemplates()
				   .pipe(
					   map((templates: Array<WeekdayTemplate>) => {
						   return weekdayTemplates.map((weekdayTemplate: WeekdayTemplate) => {
							   const weekday = weekdayTemplate.weekday;
							   return new WeekdayTemplate(weekday, this.getWeekdayTemplates(weekday, templates));
						   });
					   })
				   );
	}

	nextTemplate(weekdayTemplate: WeekdayTemplate): void {
		const newTemplates = this.replaceWeekdayTemplate(weekdayTemplate);
		this.next(newTemplates);
	}

	private replaceWeekdayTemplate(newTemplate: WeekdayTemplate): Array<WeekdayTemplate> {
		return this.getValues().map((weekdayTemplate: WeekdayTemplate) => {
			return newTemplate.weekday === weekdayTemplate.weekday ? newTemplate : weekdayTemplate;
		});
	}

	private getWeekdayTemplates(weekday: Weekday, templates: Array<WeekdayTemplate>): Array<TemplateActivity> {
		return templates.filter((weekdayTemplate: WeekdayTemplate) => weekdayTemplate.weekday === weekday)[0]?.templates;
	}
}
