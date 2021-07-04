import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../common/cdk/smart-repository';
import { ActivityConfig } from '../activity-config';
import { Observable } from 'rxjs';
import { FirebaseDefinedActivitiesService } from '../../infrastructure/firebase-defined-activities.service';

@Injectable()
export class DefinedActivitiesRepository extends SmartRepository<Array<ActivityConfig>> {

	constructor(private readonly firebaseTemplatesService: FirebaseDefinedActivitiesService) {
		super();
	}

	getValuesFromApi(): Observable<Array<ActivityConfig>> {
		return this.firebaseTemplatesService.loadDefinedActivities();
	}
}
