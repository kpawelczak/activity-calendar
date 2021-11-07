import { Injectable } from '@angular/core';
import { ActivityConfig } from '../activity-config';
import { FirebaseDefinedActivityService } from '../../infrastructure/firebase-defined-activity.service';
import { Observable, of } from 'rxjs';
import { DefinedActivitiesRepository } from './defined-activities.repository';
import { map, switchMap, take } from 'rxjs/operators';
import { ActivitiesConfigStorage } from '../../storage/activities-config.storage';
import { DomainChangesService } from '../../../domain/changes/store/domain-changes.service';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { DomainChangesType } from '../../../domain/changes/domain-changes.type';
import { Reactive } from '../../../../common/cdk/reactive';


@Injectable()
export class DefinedActivityService extends Reactive {

	constructor(private readonly firebaseDefinedActivityService: FirebaseDefinedActivityService,
				private readonly activitiesConfigStorage: ActivitiesConfigStorage,
				private readonly domainChangesService: DomainChangesService,
				private readonly definedActivitiesRepository: DefinedActivitiesRepository,
				private readonly authService: AuthenticationService) {
		super();
	}

	addActivityConfig(activityConfig: ActivityConfig): Observable<void> {
		activityConfig.setNewUUID();

		return this.firebaseDefinedActivityService
				   .addDefinedActivity(activityConfig)
				   .pipe(
					   switchMap(() => {
						   const definedActivities = this.definedActivitiesRepository.getValues();
						   definedActivities.push(activityConfig);
						   this.next(definedActivities);
						   return this.onRegisteredChanges(definedActivities);
					   }),
					   take(1)
				   );
	}

	editActivityConfig(editedActivityConfig: ActivityConfig): Observable<void> {

		return this.firebaseDefinedActivityService
				   .editDefinedActivity(editedActivityConfig)
				   .pipe(
					   switchMap(() => {
						   const definedActivities = this.definedActivitiesRepository.getValues(),
							   editedActivityConfigIndex = definedActivities
								   .findIndex((activityConfig: ActivityConfig) => activityConfig.getUUID() === editedActivityConfig.getUUID());

						   definedActivities[editedActivityConfigIndex] = editedActivityConfig;

						   this.next(definedActivities);

						   return this.onRegisteredChanges(definedActivities);
					   }),
					   take(1)
				   );
	}

	deleteActivityConfig(deletedActivityConfig: ActivityConfig): Observable<void> {
		return this.firebaseDefinedActivityService
				   .deleteDefinedActivity(deletedActivityConfig.getUUID())
				   .pipe(
					   switchMap(() => {
						   const definedActivities = this.definedActivitiesRepository.getValues(),
							   deletedActivityConfigIndex = definedActivities
								   .findIndex((activityConfig: ActivityConfig) => activityConfig.getUUID() === deletedActivityConfig.getUUID());

						   definedActivities.splice(deletedActivityConfigIndex, 1);

						   this.next(definedActivities);

						   return this.onRegisteredChanges(definedActivities);
					   }),
					   take(1)
				   );
	}

	private next(definedActivities: Array<ActivityConfig>) {
		this.definedActivitiesRepository.next(definedActivities);
	}

	private onRegisteredChanges(definedActivities: Array<ActivityConfig>): Observable<void> {
		return this.authService
				   .onLoggedIn()
				   .pipe(
					   switchMap((loggedIn: boolean) => {
						   this.activitiesConfigStorage.storeDefinedActivities(definedActivities, loggedIn);
						   return loggedIn
							   ? this.domainChangesService.registerNewChange(DomainChangesType.DEFINED_ACTIVITIES)
							   : of(null);
					   }),
					   map((changesId: string) => {
						   this.activitiesConfigStorage.updateChangesId(changesId);
						   return;
					   })
				   );
	}
}
