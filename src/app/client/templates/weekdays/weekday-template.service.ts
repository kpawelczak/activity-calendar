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
				const newWeekdayTemplate = this.createWeekdayTemplateWithNewActivity(weekdayTemplate, templateActivity);
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

	private createWeekdayTemplateWithNewActivity(weekdayTemplate: WeekdayTemplate,
												 newTemplateActivity: TemplateActivity): WeekdayTemplate {
		let newTemplates = weekdayTemplate.templates,
			activityAlreadyInArray = false;

		newTemplates.forEach((templateActivity: TemplateActivity) => {
			if (templateActivity.UUID === newTemplateActivity.UUID) {
				activityAlreadyInArray = true;
			}
		});

		if (activityAlreadyInArray) {
			newTemplates = newTemplates.map((templateActivity: TemplateActivity) => {

				if (templateActivity.UUID === newTemplateActivity.UUID) {
					return newTemplateActivity;
				}

				return templateActivity;
			});
		} else {
			newTemplates.push(newTemplateActivity);
		}

		return new WeekdayTemplate(weekdayTemplate.weekday, newTemplates);
	}

	private createWeekdayTemplateWithDeletedActivity(weekdayTemplate: WeekdayTemplate,
													 templateActivityUUID: string): WeekdayTemplate {
		const templatesUUID = weekdayTemplate.templates
											 .map((templateActivity: TemplateActivity) => {
												 return templateActivity.UUID;
											 }),
			deletedTemplateActivityIndex = templatesUUID.indexOf(templateActivityUUID);

		weekdayTemplate.templates.splice(deletedTemplateActivityIndex, 1);

		return weekdayTemplate;
	}
}
