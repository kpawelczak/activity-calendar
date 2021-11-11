import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { WeekdayTemplate } from '../weekday-template';
import { FirebaseTemplatesService } from '../../infrastructure/firebase-templates.service';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { ActiveTemplateSetService } from '../sets/active-template-set.service';
import { DomainChangesRepository } from '../../../domain/changes/store/domain-changes.repository';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { DomainChanges } from '../../../domain/changes/domain-changes';
import { TemplatesStorage } from '../../storage/templates.storage';
import { map, switchMap, take } from 'rxjs/operators';
import { TemplateSet } from '../sets/template-set';


@Injectable()
export class TemplatesRepository extends SmartRepository<Array<WeekdayTemplate>> {

	constructor(private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly domainChangesRepository: DomainChangesRepository,
				private readonly templatesStorage: TemplatesStorage,
				private readonly authService: AuthenticationService) {
		super();
	}

	getValuesFromApi(): Observable<Array<WeekdayTemplate>> {
		return combineLatest([
			this.authService.onLoggedIn(),
			this.activeTemplateSetService.onValues()
		])
			.pipe(
				switchMap(([loggedIn, templateSet]: [boolean, TemplateSet]) => {
					const storedTemplates = this.templatesStorage.getStoredTemplates(templateSet, loggedIn);
					return loggedIn
						? this.onValuesWithLoggedInUser(templateSet, storedTemplates, loggedIn)
						: of(storedTemplates);
				}),
				map((weekdayTemplates: Array<WeekdayTemplate>) => {
					return !!weekdayTemplates?.length ? weekdayTemplates : [];
				}),
				take(1)
			);
	}

	onLoadTemplates(templateSetName: TemplateSet): Observable<Array<WeekdayTemplate>> {
		return this.authService
				   .onLoggedIn()
				   .pipe(
					   switchMap((loggedIn: boolean) => {
						   const storedTemplates = this.templatesStorage.getStoredTemplates(templateSetName, loggedIn);
						   return loggedIn
							   ? this.onValuesWithLoggedInUser(templateSetName, storedTemplates, loggedIn)
							   : of(storedTemplates);
					   }),
					   take(1)
				   );
	}

	private onValuesWithLoggedInUser(templateSet: TemplateSet,
									 storedTemplates: Array<WeekdayTemplate>,
									 loggedIn: boolean): Observable<Array<WeekdayTemplate>> {
		return this.domainChangesRepository
				   .onValues()
				   .pipe(
					   map((domainChanges: DomainChanges) => {
						   const storedChangesId = this.templatesStorage.getStoredChangesIds()?.templatesId ?? '-1';
						   return domainChanges.getTemplatesId() === storedChangesId;
					   }),
					   switchMap((checkStorage: boolean) => {
						   return checkStorage && !!storedTemplates
							   ? of(storedTemplates)
							   : this.loadTemplatesFromFirebase(templateSet, loggedIn);
					   })
				   );
	}

	private loadTemplatesFromFirebase(templateSet: TemplateSet, loggedIn: boolean): Observable<Array<WeekdayTemplate>> {
		return this.firebaseTemplatesService
				   .loadTemplates(templateSet.uuid)
				   .pipe(
					   map((templates: Array<WeekdayTemplate>) => {
						   this.templatesStorage.storeTemplates(templateSet, templates, loggedIn);
						   return templates;
					   })
				   );
	}
}
