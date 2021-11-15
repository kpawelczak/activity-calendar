import { Injectable } from '@angular/core';
import { FirebaseTemplateSetsService } from '../../infrastructure/firebase-template-sets.service';
import { TemplateSetsRepository } from './template-sets.repository';
import { map, switchMap, take } from 'rxjs/operators';
import { combineLatest, Observable, of } from 'rxjs';
import { ActiveTemplateSetService } from './active-template-set.service';
import { TemplatesService } from '../templates/templates.service';
import { FirebaseTemplateService } from '../../infrastructure/firebase-template.service';
import { Reactive } from '../../../../common/cdk/reactive';
import { TemplateSet } from './template-set';
import { defaultTemplateSet } from './default-template-set-name';
import { TemplatesStorage } from '../../storage/templates.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { DomainChangesService } from '../../../domain/changes/store/domain-changes.service';
import { v4 as uuidv4 } from 'uuid';
import { DomainChangesType } from '../../../domain/changes/domain-changes.type';
import { LocalTemplateChangesType } from '../../storage/local-template-changes-type';


@Injectable()
export class TemplateSetsService extends Reactive {

	constructor(private readonly firebaseTemplateSetsService: FirebaseTemplateSetsService,
				private readonly firebaseTemplateService: FirebaseTemplateService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly templateSetsRepository: TemplateSetsRepository,
				private readonly templatesService: TemplatesService,
				private readonly domainChangesService: DomainChangesService,
				private readonly templatesStorage: TemplatesStorage,
				private readonly authService: AuthenticationService) {
		super();
	}

	addTemplateSetName(name: string): Observable<boolean> {
		const uuid = uuidv4(),
			templateSet = { name, uuid };

		return combineLatest([
			this.authService.onLoggedIn(),
			this.templateSetsRepository.onValues().pipe(take(1))
		])
			.pipe(
				switchMap(([loggedIn, templateSets]: [boolean, Array<TemplateSet>]) => {
					const currentTemplateSets = [...templateSets],
						newTemplateSets = currentTemplateSets.concat(templateSet);
					return loggedIn
						? this.postTemplateSetToFirebase(templateSet, newTemplateSets)
						: this.storeNewTemplateSets(false, newTemplateSets);
				}),
				take(1)
			);
	}

	editTemplateSetName(newTemplateSetName: string, oldTemplateSet: TemplateSet): Observable<boolean> {
		const updatedTemplateSet = {
			...oldTemplateSet,
			name: newTemplateSetName
		};

		return combineLatest([
			this.authService.onLoggedIn(),
			this.templateSetsRepository.onValues().pipe(take(1))
		])
			.pipe(
				switchMap(([loggedIn, templateSets]: [boolean, Array<TemplateSet>]) => {
					const oldTemplateSetNameIndex = templateSets.findIndex((templateSet: TemplateSet) => templateSet.uuid === oldTemplateSet.uuid);

					templateSets[oldTemplateSetNameIndex] = updatedTemplateSet;

					return loggedIn
						? this.putTemplateSetToFirebase(templateSets)
						: this.storeNewTemplateSets(loggedIn, templateSets);
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
				}),
				take(1));
	}

	deleteTemplate(templateSet: TemplateSet): Observable<boolean> {
		return combineLatest([
			this.authService.onLoggedIn(),
			this.templateSetsRepository.onValues().pipe(take(1))
		])
			.pipe(
				switchMap(([loggedIn, templateSets]: [boolean, Array<TemplateSet>]) => {
					const newTemplateSets = this.getTemplateSetsWithRemovedItem(templateSet, [...templateSets]);

					return loggedIn
						? this.deleteTemplateSetFromFirebase(templateSet, newTemplateSets)
						: this.storeNewTemplateSets(false, newTemplateSets);
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
		return [...templateSets].filter((templateSetName: TemplateSet) => templateSetName.uuid !== deletedTemplateSetName.uuid);
	}

	private deleteTemplateSetFromFirebase(templateSet: TemplateSet, templateSets: Array<TemplateSet>): Observable<boolean> {
		return this.firebaseTemplateSetsService
				   .deleteTemplate(templateSet)
				   .pipe(
					   switchMap(() => {
						   return this.registerChanges(templateSets);
					   })
				   );
	}

	private putTemplateSetToFirebase(templateSets: Array<TemplateSet>): Observable<boolean> {
		return this.firebaseTemplateSetsService
				   .editTemplate(templateSets)
				   .pipe(
					   switchMap(() => {
						   return this.registerChanges(templateSets);
					   })
				   );
	}

	private postTemplateSetToFirebase(templateSet: TemplateSet, templateSets: Array<TemplateSet>): Observable<boolean> {
		return this.firebaseTemplateSetsService
				   .addTemplate(templateSet)
				   .pipe(
					   switchMap(() => {
						   return this.registerChanges(templateSets);
					   })
				   );
	}

	private storeNewTemplateSets(loggedIn: boolean,
								 templateSets: Array<TemplateSet>): Observable<boolean> {
		this.templatesStorage.storeTemplateSet(loggedIn, templateSets);
		this.templateSetsRepository.next([...templateSets]);
		return of(!!templateSets);
	}

	private registerChanges(templateSets: Array<TemplateSet>): Observable<boolean> {
		return this.storeNewTemplateSets(true, templateSets)
				   .pipe(
					   switchMap(() => {
						   return this.domainChangesService.registerNewChange(DomainChangesType.TEMPLATES_SET);
					   }),
					   map((changesId: string) => {
						   this.templatesStorage.updateChangesId(changesId, LocalTemplateChangesType.TEMPLATES_SET);
						   return !!changesId;
					   }));
	}
}
