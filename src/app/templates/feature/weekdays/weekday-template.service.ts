import { Injectable } from '@angular/core';
import { FirebaseTemplatesService } from '../../infrastructure/firebase-templates.service';
import { TemplateActivity } from '../../template-activity';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { FirebaseTemplateCountersService } from '../../infrastructure/firebase-template-counters.service';
import { WeekdayTemplatesRepository } from '../../store/weekday-templates.repository';
import { WeekdayTemplateCountersRepository } from '../../store/counters/weekday-template-counters.repository';
import { WeekdayTemplate } from '../../store/template/weekday-template';
import { TemplateCounter } from '../../store/counters/template-counter';


@Injectable()
export class WeekdayTemplateService {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly firebaseTemplateCountersService: FirebaseTemplateCountersService,
				private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
				private readonly weekdayTemplateCountersRepository: WeekdayTemplateCountersRepository) {
	}

	addActivityToTemplate(weekdayTemplate: WeekdayTemplate, templateActivity: TemplateActivity): void {
		this.saveActivityToTemplate(weekdayTemplate, templateActivity)
			.subscribe((newWeekdayTemplate: WeekdayTemplate) => {
				this.updateCounter(newWeekdayTemplate);
			});
	}

	saveActivityToTemplate(weekdayTemplate: WeekdayTemplate, templateActivity: TemplateActivity): Observable<WeekdayTemplate> {
		return from(this.firebaseTemplatesService.saveActivityToTemplate(weekdayTemplate.weekday, templateActivity))
			.pipe(
				map(() => {
					const newWeekdayTemplate = this.createWeekdayTemplateWithUpdatedActivity(
						weekdayTemplate,
						templateActivity
					);
					this.weekdayTemplatesRepository.next(newWeekdayTemplate);
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
		this.weekdayTemplatesRepository.next(newWeekdayTemplate);
		this.updateCounter(newWeekdayTemplate);
	}

	private updateCounter(weekdayTemplate: WeekdayTemplate): void {

		const weekdayTemplateCounter = { [weekdayTemplate.weekday]: weekdayTemplate.templates.length } as TemplateCounter;
		this.firebaseTemplateCountersService.updateTemplateCounters(weekdayTemplateCounter);
		this.weekdayTemplateCountersRepository.updateCounter(weekdayTemplateCounter);
	}
}
