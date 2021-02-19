import { Injectable } from '@angular/core';
import { FirebaseTemplatesService } from '../../../firebase/templates/firebase-templates.service';
import { TemplateActivity } from '../../../repositories/templates/template-activity';
import { WeekdayTemplatesRepository } from '../../../repositories/templates/weekday-templates.repository';
import { WeekdayTemplate } from '../../../repositories/templates/weekday-template';

@Injectable()
export class WeekdayTemplateService {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository) {
	}

	saveActivityToTemplate(weekdayTemplate: WeekdayTemplate, templateActivity: TemplateActivity): void {

		this.firebaseTemplatesService
			.saveActivityToTemplate(weekdayTemplate.weekday, templateActivity)
			.then(() => {
				const newWeekdayTemplate = this.createWeekdayTemplateWithUpdatedActivity(
					weekdayTemplate,
					templateActivity
				);
				this.weekdayTemplatesRepository.next(newWeekdayTemplate);
			});
	}

	deleteTemplateActivity(weekdayTemplate: WeekdayTemplate, templateActivityUUID: string): void {

		this.firebaseTemplatesService
			.deleteTemplateActivity(weekdayTemplate.weekday, templateActivityUUID)
			.then(() => {
				const newWeekdayTemplate = this.createWeekdayTemplateWithDeletedActivity(weekdayTemplate, templateActivityUUID);
				this.weekdayTemplatesRepository.next(newWeekdayTemplate);
			});
	}

	private createWeekdayTemplateWithUpdatedActivity(weekdayTemplate: WeekdayTemplate,
													 newTemplateActivity: TemplateActivity): WeekdayTemplate {
		let newTemplates = weekdayTemplate.templates;

		newTemplates = newTemplates.map((templateActivity: TemplateActivity) => {

			if (templateActivity.UUID === newTemplateActivity.UUID) {
				return newTemplateActivity;
			}

			return templateActivity;
		});

		return new WeekdayTemplate(weekdayTemplate.weekday, newTemplates);
	}

	private createWeekdayTemplateWithDeletedActivity(weekdayTemplate: WeekdayTemplate,
													 templateActivityUUID: string): WeekdayTemplate {
		const templates = weekdayTemplate.templates,
			deletedTemplateActivityIndex = templates.findIndex((templateActivity: TemplateActivity) => {
				return templateActivity.UUID === templateActivityUUID;
			});

		weekdayTemplate.templates.splice(deletedTemplateActivityIndex, 1);

		return weekdayTemplate;
	}
}
