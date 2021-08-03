import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { WeekdayTemplate } from '../weekday-template';
import { FirebaseTemplatesService } from '../../infrastructure/firebase-templates.service';
import { TemplatesRepository } from './templates.repository';
import { ActiveTemplateSetService } from '../sets/active-template-set.service';

@Injectable()
export class TemplatesService {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly templatesRepository: TemplatesRepository) {
	}

	loadTemplates(templateSetName: string): void {
		this.firebaseTemplatesService
			.loadTemplates(templateSetName)
			.pipe(take(1))
			.subscribe((weekdayTemplates: Array<WeekdayTemplate>) => {
				this.templatesRepository.next([...weekdayTemplates]);
			});
	}

	nextTemplate(weekdayTemplate: WeekdayTemplate): void {
		const newTemplates = this.replaceWeekdayTemplate(weekdayTemplate);
		this.templatesRepository.next(newTemplates);
	}

	private replaceWeekdayTemplate(newTemplate: WeekdayTemplate): Array<WeekdayTemplate> {
		return this.templatesRepository.getValues()
				   .map((weekdayTemplate: WeekdayTemplate) => {
					   return newTemplate.getWeekday() === weekdayTemplate.getWeekday() ? newTemplate : weekdayTemplate;
				   });
	}
}
