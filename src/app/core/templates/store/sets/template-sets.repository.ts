import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { Observable, of } from 'rxjs';
import { FirebaseTemplateSetsService } from '../../infrastructure/firebase-template-sets.service';
import { map, switchMap, take } from 'rxjs/operators';
import { TemplatesStorage } from '../../storage/templates.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { DomainChanges } from '../../../domain/changes/domain-changes';
import { DomainChangesRepository } from '../../../domain/changes/store/domain-changes.repository';
import { TemplateSet } from './template-set';


@Injectable()
export class TemplateSetsRepository extends SmartRepository<Array<TemplateSet>> {

	constructor(private readonly firebaseTemplateSets: FirebaseTemplateSetsService,
				private readonly domainChangesRepository: DomainChangesRepository,
				private readonly templatesStorage: TemplatesStorage,
				private readonly authService: AuthenticationService) {
		super();
	}

	getValuesFromApi(): Observable<Array<TemplateSet>> {
		return this.authService
				   .onLoggedIn()
				   .pipe(
					   switchMap((loggedIn: boolean) => {
						   const storedTemplateSets = this.templatesStorage.getStoredTemplateSets(loggedIn);
						   return loggedIn
							   ? this.onValuesWithLoggedInUser(storedTemplateSets, loggedIn)
							   : of(storedTemplateSets);
					   }),
					   map((templateSets: Array<TemplateSet>) => {
						   return !!templateSets?.length ? templateSets : [];
					   }),
					   take(1)
				   );
	}

	private onValuesWithLoggedInUser(storedTemplateSets: Array<TemplateSet>,
									 loggedIn: boolean): Observable<Array<TemplateSet>> {
		return this.domainChangesRepository
				   .onValues()
				   .pipe(
					   map((domainChanges: DomainChanges) => {
						   const storedChangesId = this.templatesStorage.getStoredChangesIds()?.templateSetsId ?? '-1';
						   return domainChanges.getTemplateSetsId() === storedChangesId;
					   }),
					   switchMap((checkStorage: boolean) => {
						   return checkStorage && !!storedTemplateSets
							   ? of(storedTemplateSets)
							   : this.firebaseTemplateSets.getTemplateSets()
									 .pipe(
										 map((templateSets: Array<TemplateSet>) => {
											 this.templatesStorage.storeTemplateSet(loggedIn, templateSets);
											 return templateSets;
										 })
									 );
					   })
				   );
	}
}
