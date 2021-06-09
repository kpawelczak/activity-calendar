import { Injectable } from '@angular/core';
import { FirebaseTemplateSetsService } from '../../infrastructure/firebase-template-sets.service';
import { TemplateSetsRepository } from './template-sets.repository';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActiveTemplateSetService } from './active-template-set.service';
import { TemplatesService } from '../templates/templates.service';
import { FirebaseTemplateService } from '../../infrastructure/firebase-template.service';
import { WeekdayTemplate } from '../weekday-template';
import { TemplatesRepository } from '../templates/templates.repository';
import { TemplateActivity } from '../../template-activity';

@Injectable()
export class TemplateSetsService {

	constructor(private readonly firebaseTemplateSetsService: FirebaseTemplateSetsService,
				private readonly firebaseTemplateService: FirebaseTemplateService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly templateSetsRepository: TemplateSetsRepository,
				private readonly templatesService: TemplatesService,
				private readonly templatesRepository: TemplatesRepository) {
	}

	addTemplateSetName(templateSetName: string): Observable<boolean> {
		return this.firebaseTemplateSetsService
				   .addTemplate(templateSetName)
				   .pipe(
					   map(() => {
						   const currentTemplateSets = [...this.templateSetsRepository.getValues()],
							   newTemplateSets = currentTemplateSets.concat(templateSetName);
						   this.templateSetsRepository.next(newTemplateSets);
						   return !!newTemplateSets;
					   }),
					   take(1)
				   );
	}

	deleteTemplate(templateSetName: string): Observable<boolean> {
		return this.firebaseTemplateSetsService
				   .deleteTemplate(templateSetName)
				   .pipe(
					   map(() => {
						   const currentTemplateSets = [...this.templateSetsRepository.getValues()],
							   newTemplateSets = this.getTemplateSetsWithRemovedItem(templateSetName, currentTemplateSets);

						   this.templateSetsRepository.next(newTemplateSets);

						   return !!newTemplateSets;
					   }),
					   switchMap(() => {
						   return this.templatesRepository.onValues();
					   }),
					   map((templates: Array<WeekdayTemplate>) => {

						   templates.forEach((weekdayTemplate: WeekdayTemplate) => {
							   weekdayTemplate.getTemplates()
											  .forEach((templateActivity: TemplateActivity) => {
												  this.firebaseTemplateService
													  .deleteTemplateActivity(templateActivity.templateUUID)
													  .then();
											  });
						   });

						   return !!templates;
					   }),
					   switchMap(() => {
						   return this.activeTemplateSetService.onValues();
					   }),
					   map((activeTemplateSet: string) => {

						   if (activeTemplateSet === templateSetName) {
							   this.activeTemplateSetService.selectTemplateSet('default');
							   this.templatesService.loadTemplates('default');
						   }

						   return !!activeTemplateSet;
					   }),
					   take(1)
				   );
	}

	private getTemplateSetsWithRemovedItem(deletedTemplateSetName: string, templateSetNames: Array<string>): Array<string> {
		return templateSetNames.filter((templateSetName) => templateSetName !== deletedTemplateSetName);
	}
}
