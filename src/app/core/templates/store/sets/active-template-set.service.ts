import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { Observable, of } from 'rxjs';
import { FirebaseActiveTemplateSetService } from '../../infrastructure/firebase-active-template-set.service';
import { map, switchMap, take } from 'rxjs/operators';
import { TemplateSet } from './template-set';
import { DomainChangesRepository } from '../../../domain/changes/store/domain-changes.repository';
import { TemplatesStorage } from '../../storage/templates.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { DomainChanges } from '../../../domain/changes/domain-changes';
import { defaultTemplateSet } from './default-template-set-name';
import { DomainChangesType } from '../../../domain/changes/domain-changes.type';
import { LocalTemplateChangesType } from '../../storage/local-template-changes-type';
import { DomainChangesService } from '../../../domain/changes/store/domain-changes.service';


@Injectable()
export class ActiveTemplateSetService extends SmartRepository<TemplateSet> {

	constructor(private readonly firebaseActiveTemplateSetService: FirebaseActiveTemplateSetService,
				private readonly domainChangesRepository: DomainChangesRepository,
				private readonly domainChangesService: DomainChangesService,
				private readonly templatesStorage: TemplatesStorage,
				private readonly authService: AuthenticationService) {
		super();
	}

	getValuesFromApi(): Observable<TemplateSet> {
		return this.authService
				   .onLoggedIn()
				   .pipe(
					   switchMap((loggedIn: boolean) => {
						   const activeTemplate = this.templatesStorage.getStoredActiveTemplate(loggedIn);
						   return loggedIn
							   ? this.onValuesWithLoggedInUser(activeTemplate, loggedIn)
							   : of(activeTemplate);
					   }),
					   map((activeTemplate: TemplateSet) => {
						   return !!activeTemplate ? activeTemplate : defaultTemplateSet;
					   }),
					   take(1)
				   );
	}

	selectTemplateSet(templateSet: TemplateSet): void {
		this.authService
			.onLoggedIn()
			.pipe(
				switchMap((loggedIn: boolean) => {

					this.templatesStorage.storeActiveTemplateSet(loggedIn, templateSet);
					this.next(templateSet);

					if (loggedIn) {

						this.firebaseActiveTemplateSetService
							.changeActiveTemplateSet(templateSet)
							.then();
					}

					return loggedIn
						? this.domainChangesService.registerNewChange(DomainChangesType.ACTIVE_TEMPLATE)
						: of(null);
				}),
				take(1),
				this.takeUntil()
			)
			.subscribe((changesId: string) => {
				this.templatesStorage
					.updateChangesId(changesId, LocalTemplateChangesType.ACTIVE_TEMPLATE);
			});
	}

	private onValuesWithLoggedInUser(activeTemplate: TemplateSet,
									 loggedIn: boolean): Observable<TemplateSet> {
		return this.domainChangesRepository
				   .onValues()
				   .pipe(
					   map((domainChanges: DomainChanges) => {
						   const storedChangesId = this.templatesStorage.getStoredChangesIds()?.activeTemplateId ?? '-1';
						   return domainChanges.getActiveTemplateId() === storedChangesId;
					   }),
					   switchMap((checkStorage: boolean) => {
						   return checkStorage && !!activeTemplate
							   ? of(activeTemplate)
							   : this.firebaseActiveTemplateSetService.getActiveTemplateSet()
									 .pipe(
										 map((templateSet: TemplateSet) => {
											 this.templatesStorage.storeActiveTemplateSet(loggedIn, templateSet);
											 return templateSet;
										 })
									 );
					   })
				   );
	}
}
