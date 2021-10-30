import { Injectable } from '@angular/core';
import { FirebaseTemplateService } from '../../infrastructure/firebase-template.service';
import { TemplateActivity } from '../../template-activity';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { WeekdayTemplate } from '../weekday-template';
import { TemplatesService } from '../templates/templates.service';
import { QuantifiedActivity } from '../../../../common/ui/quantified-activity/quantified-activity';

import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class TemplateService {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplateService,
				private readonly templatesService: TemplatesService) {
	}

	saveActivityToTemplate(weekdayTemplate: WeekdayTemplate,
						   name: string,
						   quantifiedActivities: Array<QuantifiedActivity>,
						   templateActivity?: TemplateActivity): Observable<WeekdayTemplate> {
		const changedTemplateActivity
			= new TemplateActivity(
			weekdayTemplate.getWeekday(),
			name,
			quantifiedActivities,
			this.getTemplateUUID(templateActivity),
			templateActivity?.templateSetName);

		return this.firebaseTemplatesService
				   .saveActivityToTemplate(changedTemplateActivity)
				   .pipe(
					   map(() => {
						   let newWeekdayTemplate;

						   if (!templateActivity) {
							   weekdayTemplate.addTemplate(changedTemplateActivity);
							   newWeekdayTemplate = weekdayTemplate;
						   } else {
							   newWeekdayTemplate = this.createWeekdayTemplateWithUpdatedActivity(
								   weekdayTemplate,
								   changedTemplateActivity
							   );
						   }

						   this.templatesService.nextTemplate(newWeekdayTemplate);
						   return newWeekdayTemplate;
					   }),
					   take(1)
				   );
	}

	deleteTemplateActivity(weekdayTemplate: WeekdayTemplate,
						   templateActivity: TemplateActivity): void {
		if (!templateActivity.name) {
			this.removeActivityFromRepository(weekdayTemplate, templateActivity);
			return;
		}

		this.firebaseTemplatesService
			.deleteTemplateActivity(templateActivity.templateUUID)
			.then(() => {
				this.removeActivityFromRepository(weekdayTemplate, templateActivity);
			});
	}

	private createWeekdayTemplateWithUpdatedActivity(weekdayTemplate: WeekdayTemplate,
													 newTemplateActivity: TemplateActivity): WeekdayTemplate {
		let newTemplates = weekdayTemplate.getTemplates();

		newTemplates = newTemplates.map((templateActivity: TemplateActivity) => {

			if (templateActivity.templateUUID === newTemplateActivity.templateUUID) {
				return newTemplateActivity;
			}

			return templateActivity;
		});

		newTemplates = newTemplates.filter((templateActivity: TemplateActivity) => templateActivity.name);

		return new WeekdayTemplate(weekdayTemplate.getWeekday(), newTemplates);
	}

	private createWeekdayTemplateWithDeletedActivity(weekdayTemplate: WeekdayTemplate,
													 templateActivityUUID: string): WeekdayTemplate {
		const templates = weekdayTemplate.getTemplates().filter((templateActivity: TemplateActivity) => templateActivity.name),
			deletedTemplateActivityIndex = templates.findIndex((templateActivity: TemplateActivity) => {
				return templateActivity.templateUUID === templateActivityUUID;
			});

		weekdayTemplate.removeTemplate(deletedTemplateActivityIndex);

		return weekdayTemplate;
	}

	private removeActivityFromRepository(weekdayTemplate: WeekdayTemplate, templateActivity: TemplateActivity): void {
		const newWeekdayTemplate = this.createWeekdayTemplateWithDeletedActivity(weekdayTemplate, templateActivity.templateUUID);
		this.templatesService.nextTemplate(newWeekdayTemplate);
	}

	private getTemplateUUID(templateActivity: TemplateActivity): string {
		return templateActivity?.templateUUID
			? templateActivity.templateUUID
			: uuidv4();
	}
}
