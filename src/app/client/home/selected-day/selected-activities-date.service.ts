import { Injectable } from '@angular/core';
import { ValuesRepository } from '../../../common/cdk/values-repository';

@Injectable()
export class SelectedActivitiesDateService extends ValuesRepository<Date> {

	constructor() {
		super();
	}
}
