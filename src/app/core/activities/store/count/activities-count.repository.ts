import { Injectable } from '@angular/core';
import { ActivitiesCount } from './activities-count';
import { FirebaseActivitiesCountService } from '../../infrastructure/firebase-activities-count.service';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { Observable, of } from 'rxjs';

import { map, switchMap, take } from 'rxjs/operators';
import { ActivitiesStorage } from '../../storage/activities.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { DomainChangesRepository } from '../../../domain/changes/store/domain-changes.repository';
import { DomainChanges } from '../../../domain/changes/domain-changes';


@Injectable()
export class ActivitiesCountRepository extends SmartRepository<Array<ActivitiesCount>> {

	constructor(private readonly firebaseActivitiesCountService: FirebaseActivitiesCountService,
				private readonly domainChangesRepository: DomainChangesRepository,
				private readonly authService: AuthenticationService,
				private readonly activitiesStorage: ActivitiesStorage) {
		super();
	}

	getValuesFromApi(): Observable<Array<ActivitiesCount>> {
		return this.authService
				   .onLoggedIn()
				   .pipe(
					   switchMap((loggedIn: boolean) => {
						   const storedActivitiesCount = this.activitiesStorage.getStoredActivitiesCount(loggedIn);
						   return loggedIn
							   ? this.onActivitiesCountWithLoggedInUser(storedActivitiesCount, loggedIn)
							   : of(storedActivitiesCount);
					   }),
					   map((activitiesCount: Array<ActivitiesCount>) => {
						   return !!activitiesCount?.length ? activitiesCount : [];
					   }),
					   take(1)
				   );
	}

	private onActivitiesCountWithLoggedInUser(storedActivitiesCount: Array<ActivitiesCount>,
											  loggedIn: boolean): Observable<Array<ActivitiesCount>> {
		return this.domainChangesRepository
				   .onValues()
				   .pipe(
					   map((domainChanges: DomainChanges) => {
						   return domainChanges.getActivitiesId() === this.activitiesStorage.getStoredChangesId();
					   }),
					   switchMap((checkStorage: boolean) => {
						   return checkStorage && !!storedActivitiesCount
							   ? of(storedActivitiesCount)
							   : this.firebaseActivitiesCountService
									 .getActivitiesCount()
									 .pipe(
										 map((activitiesCount: Array<ActivitiesCount>) => {
											 this.activitiesStorage.storeActivitiesCount(activitiesCount, loggedIn);
											 return activitiesCount;
										 })
									 );
					   })
				   );
	}
}
