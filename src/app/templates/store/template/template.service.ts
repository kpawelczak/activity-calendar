import { Injectable } from '@angular/core';
import { FirebaseTemplateService } from '../../infrastructure/firebase-template.service';
import { TemplateActivity } from '../../template-activity';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { TemplatesRepository } from '../templates/templates.repository';
import { WeekdayTemplate } from '../weekday-template';


@Injectable()
export class TemplateService {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplateService,
				private readonly weekdayTemplatesRepository: TemplatesRepository) {
	}

	addActivityToTemplate(weekdayTemplate: WeekdayTemplate, templateActivity: TemplateActivity): void {
		this.saveActivityToTemplate(weekdayTemplate, templateActivity).subscribe();
	}

	saveActivityToTemplate(weekdayTemplate: WeekdayTemplate, templateActivity: TemplateActivity): Observable<WeekdayTemplate> {
		return from(this.firebaseTemplatesService.saveActivityToTemplate(weekdayTemplate.weekday, templateActivity))
			.pipe(
				map(() => {
					const newWeekdayTemplate = this.createWeekdayTemplateWithUpdatedActivity(
						weekdayTemplate,
						templateActivity
					);
					this.weekdayTemplatesRepository.nextTemplate(newWeekdayTemplate);
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
			.deleteTemplateActivity(weekdayTemplate.weekday, templateActivity.templateUUID)
			.then(() => {
				this.removeActivityFromRepository(weekdayTemplate, templateActivity);
			});
	}

	private createWeekdayTemplateWithUpdatedActivity(weekdayTemplate: WeekdayTemplate,
													 newTemplateActivity: TemplateActivity): WeekdayTemplate {
		let newTemplates = weekdayTemplate.templates;

		newTemplates = newTemplates.map((templateActivity: TemplateActivity) => {

			if (templateActivity.templateUUID === newTemplateActivity.templateUUID) {
				return newTemplateActivity;
			}

			return templateActivity;
		});

		newTemplates = newTemplates.filter((templateActivity: TemplateActivity) => templateActivity.name);

		return new WeekdayTemplate(weekdayTemplate.weekday, newTemplates);
	}

	private createWeekdayTemplateWithDeletedActivity(weekdayTemplate: WeekdayTemplate,
													 templateActivityUUID: string): WeekdayTemplate {
		const templates = weekdayTemplate.templates.filter((templateActivity: TemplateActivity) => templateActivity.name),
			deletedTemplateActivityIndex = templates.findIndex((templateActivity: TemplateActivity) => {
				return templateActivity.templateUUID === templateActivityUUID;
			});

		weekdayTemplate.templates.splice(deletedTemplateActivityIndex, 1);

		return weekdayTemplate;
	}

	private removeActivityFromRepository(weekdayTemplate: WeekdayTemplate, templateActivity: TemplateActivity): void {
		const newWeekdayTemplate = this.createWeekdayTemplateWithDeletedActivity(weekdayTemplate, templateActivity.templateUUID);
		this.weekdayTemplatesRepository.nextTemplate(newWeekdayTemplate);
	}
}
