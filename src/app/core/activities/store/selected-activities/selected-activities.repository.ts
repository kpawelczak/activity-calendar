import { Injectable } from '@angular/core';
import { ValuesRepository } from '../../../../common/cdk/values-repository';
import { CalendarActivity } from '../activities/calendar-activity';

@Injectable()
export class SelectedActivitiesRepository extends ValuesRepository<Array<CalendarActivity>> {

	constructor() {
		super();
	}
}
