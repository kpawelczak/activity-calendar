import { Injectable } from '@angular/core';
import { ActivityConfig } from '../activity-config';
import { FirebaseDefinedActivityService } from '../../infrastructure/firebase-defined-activity.service';
import { Observable } from 'rxjs';

@Injectable()
export class DefinedActivityService {

	constructor(private readonly firebaseDefinedActivityService: FirebaseDefinedActivityService) {
	}

	addActivityConfig(activityConfig: ActivityConfig): Observable<void> {
		return this.firebaseDefinedActivityService.addDefinedActivity(activityConfig);
	}

	editActivityConfig(activityConfig: ActivityConfig, oldActivityConfigName: string): Observable<void> {
		return this.firebaseDefinedActivityService.editDefinedActivity(activityConfig, oldActivityConfigName);
	}

	deleteActivityConfig(activityConfigName: string): Observable<void> {
		return this.firebaseDefinedActivityService.deleteDefinedActivity(activityConfigName);
	}
}
