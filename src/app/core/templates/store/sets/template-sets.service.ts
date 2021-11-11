import { Injectable } from '@angular/core';
import { FirebaseTemplateSetsService } from '../../infrastructure/firebase-template-sets.service';
import { TemplateSetsRepository } from './template-sets.repository';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ActiveTemplateSetService } from './active-template-set.service';
import { TemplatesService } from '../templates/templates.service';
import { FirebaseTemplateService } from '../../infrastructure/firebase-template.service';
import { Reactive } from '../../../../common/cdk/reactive';
import { TemplateSet } from './template-set';
import { defaultTemplateSet } from './default-template-set-name';

@Injectable()
export class TemplateSetsService extends Reactive {

	constructor(private readonly firebaseTemplateSetsService: FirebaseTemplateSetsService,
				private readonly firebaseTemplateService: FirebaseTemplateService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly templateSetsRepository: TemplateSetsRepository,
				private readonly templatesService: TemplatesService) {
		super();
	}

	addTemplateSetName(templateSetName: string): Observable<boolean> {
		return this.firebaseTemplateSetsService
				   .addTemplate(templateSetName)
				   .pipe(
					   map((templateSet: TemplateSet) => {
						   const currentTemplateSets = [...this.templateSetsRepository.getValues()],
							   newTemplateSets = currentTemplateSets.concat(templateSet);
						   this.templateSetsRepository.next(newTemplateSets);
						   return !!newTemplateSets;
					   }),
					   take(1)
				   );
	}

	editTemplateSetName(newTemplateSetName: string, oldTemplateSet: TemplateSet): Observable<boolean> {
		const templateSets = this.templateSetsRepository.getValues(),
			oldTemplateSetNameIndex = templateSets.findIndex((templateSet: TemplateSet) => templateSet.uuid === oldTemplateSet.uuid),
			updatedTemplateSet = {
				...oldTemplateSet,
				name: newTemplateSetName
			};

		templateSets[oldTemplateSetNameIndex] = updatedTemplateSet;

		return this.firebaseTemplateSetsService
				   .editTemplate(templateSets)
				   .pipe(
					   map(() => {
						   this.templateSetsRepository.next(templateSets);
						   return !!templateSets;
					   }),
					   switchMap(() => {
						   return this.activeTemplateSetService.onValues();
					   }),
					   map((activeTemplateSet: TemplateSet) => {

						   if (activeTemplateSet.uuid === oldTemplateSet.uuid) {
							   this.activeTemplateSetService.selectTemplateSet(updatedTemplateSet);
							   this.templatesService.loadTemplates(updatedTemplateSet);
						   }

						   return !!activeTemplateSet;
					   })
				   );
	}

	deleteTemplate(templateSet: TemplateSet): Observable<boolean> {
		return this.firebaseTemplateSetsService
				   .deleteTemplate(templateSet)
				   .pipe(
					   map(() => {
						   const currentTemplateSets = [...this.templateSetsRepository.getValues()],
							   newTemplateSets = this.getTemplateSetsWithRemovedItem(templateSet, currentTemplateSets);

						   this.templateSetsRepository.next(newTemplateSets);

						   return !!newTemplateSets;
					   }),
					   switchMap(() => {
						   return this.activeTemplateSetService.onValues();
					   }),
					   map((activeTemplateSet: TemplateSet) => {

						   if (activeTemplateSet.uuid === templateSet.uuid) {
							   this.activeTemplateSetService.selectTemplateSet(defaultTemplateSet);
							   this.templatesService.loadTemplates(templateSet);
						   }

						   return !!activeTemplateSet;
					   }),
					   take(1)
				   );
	}

	private getTemplateSetsWithRemovedItem(deletedTemplateSetName: TemplateSet, templateSets: Array<TemplateSet>): Array<TemplateSet> {
		return templateSets.filter((templateSetName: TemplateSet) => templateSetName.uuid !== deletedTemplateSetName.uuid);
	}
}
