import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../common/cdk/smart-repository';
import { Observable } from 'rxjs';
import { FirebaseTemplateSetsService } from '../../infrastructure/firebase-template-sets.service';

@Injectable()
export class WeekdayTemplateSetsRepository extends SmartRepository<any> {

	constructor(private readonly firebaseTemplateSets: FirebaseTemplateSetsService) {
		super();
	}

	getValuesFromApi(): Observable<any> {
		return this.firebaseTemplateSets.getTemplateSets();
	}
}
