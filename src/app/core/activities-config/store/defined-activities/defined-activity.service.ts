import { Injectable } from '@angular/core';
import { ActivityConfig } from '../activity-config';
import { FirebaseDefinedActivityService } from '../../infrastructure/firebase-defined-activity.service';
import { Observable } from 'rxjs';
import { DefinedActivitiesRepository } from './defined-activities.repository';
import { map, take } from 'rxjs/operators';

@Injectable()
export class DefinedActivityService {

	constructor(private readonly firebaseDefinedActivityService: FirebaseDefinedActivityService,
				private readonly definedActivitiesRepository: DefinedActivitiesRepository) {
	}

	addActivityConfig(activityConfig: ActivityConfig): Observable<void> {
		activityConfig.setNewUUID();

		return this.firebaseDefinedActivityService
				   .addDefinedActivity(activityConfig)
				   .pipe(
					   map(() => {
						   this.definedActivitiesRepository.getValues().push(activityConfig);
						   this.definedActivitiesRepository.next(this.definedActivitiesRepository.getValues());
						   return;
					   }),
					   take(1)
				   );
	}

	editActivityConfig(editedActivityConfig: ActivityConfig): Observable<void> {

		return this.firebaseDefinedActivityService
				   .editDefinedActivity(editedActivityConfig)
				   .pipe(
					   map(() => {
						   const definedActivities = this.definedActivitiesRepository.getValues(),
							   editedActivityConfigIndex = definedActivities
								   .findIndex((activityConfig: ActivityConfig) => activityConfig.getUUID() === editedActivityConfig.getUUID());

						   definedActivities[editedActivityConfigIndex] = editedActivityConfig;
						   this.definedActivitiesRepository.next(definedActivities);
						   return;
					   }),
					   take(1)
				   );
	}

	deleteActivityConfig(deletedActivityConfig: ActivityConfig): Observable<void> {
		return this.firebaseDefinedActivityService.deleteDefinedActivity(deletedActivityConfig.getUUID())
				   .pipe(
					   map(() => {
						   const definedActivities = this.definedActivitiesRepository.getValues(),
							   deletedActivityConfigIndex = definedActivities
								   .findIndex((activityConfig: ActivityConfig) => activityConfig.getUUID() === deletedActivityConfig.getUUID());

						   definedActivities.splice(deletedActivityConfigIndex, 1);

						   this.definedActivitiesRepository.next(definedActivities);
						   return;
					   }),
					   take(1)
				   );
	}
}
