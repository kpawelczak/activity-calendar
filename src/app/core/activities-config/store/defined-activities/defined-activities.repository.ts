import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { ActivityConfig } from '../activity-config';
import { Observable, of } from 'rxjs';
import { FirebaseDefinedActivitiesService } from '../../infrastructure/firebase-defined-activities.service';
import { DomainChangesRepository } from '../../../domain/changes/store/domain-changes.repository';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { map, switchMap, take } from 'rxjs/operators';
import { ActivitiesConfigStorage } from '../../storage/activities-config.storage';
import { DomainChanges } from '../../../domain/changes/domain-changes';

@Injectable()
export class DefinedActivitiesRepository extends SmartRepository<Array<ActivityConfig>> {

	constructor(private readonly firebaseDefinedActivityService: FirebaseDefinedActivitiesService,
				private readonly domainChangesRepository: DomainChangesRepository,
				private readonly activitiesConfigStorage: ActivitiesConfigStorage,
				private readonly authService: AuthenticationService) {
		super();
	}

	getValuesFromApi(): Observable<Array<ActivityConfig>> {
		return this.authService
				   .onLoggedIn()
				   .pipe(
					   switchMap((loggedIn: boolean) => {
						   const storedDefinedActivities = this.activitiesConfigStorage.getStoredDefinedActivities(loggedIn);
						   return loggedIn
							   ? this.onValuesWithLoggedInUser(storedDefinedActivities, loggedIn)
							   : of(storedDefinedActivities);
					   }),
					   map((definedActivities: Array<ActivityConfig>) => {
						   return !!definedActivities?.length ? definedActivities : [];
					   }),
					   take(1)
				   );
	}

	private onValuesWithLoggedInUser(storedDefinedActivities: Array<ActivityConfig>,
									 loggedIn: boolean): Observable<Array<ActivityConfig>> {
		return this.domainChangesRepository
				   .onValues()
				   .pipe(
					   map((domainChanges: DomainChanges) => {
						   return domainChanges.getDefinedActivitiesId() === this.activitiesConfigStorage.getStoredChangesId();
					   }),
					   switchMap((checkStorage: boolean) => {
						   return checkStorage && !!storedDefinedActivities
							   ? of(storedDefinedActivities)
							   : this.firebaseDefinedActivityService.loadDefinedActivities()
									 .pipe(
										 map((definedActivities: Array<ActivityConfig>) => {
											 this.activitiesConfigStorage.storeDefinedActivities(definedActivities, loggedIn);
											 return definedActivities;
										 })
									 );
					   })
				   );
	}
}
