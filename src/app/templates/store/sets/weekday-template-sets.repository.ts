import { Injectable } from '@angular/core';
import { SmartRepository } from '../../../common/cdk/smart-repository';
import { Observable } from 'rxjs';

@Injectable()
export class WeekdayTemplateSetsRepository extends SmartRepository<any> {
//todo probably not needed
	constructor() {
		super();
	}

	getValuesFromApi(): Observable<any> {
		return undefined;
	}
}
