import { Injectable } from '@angular/core';
import { CalendarActivity } from '../../../../common/models/calendar-activity';
import { ValuesRepository } from '../../../../common/cdk/values-repository';

@Injectable()
export class SelectedDayActivitiesRepository extends ValuesRepository<Array<CalendarActivity>> {

	constructor() {
		super();
	}

	selectDayActivities(day: Date, monthActivities: Array<CalendarActivity>): void {
		const dayActivities = monthActivities?.filter((calendarActivity: CalendarActivity) => {
			return calendarActivity.day === day.getTime();
		});
		this.next(dayActivities);
	}
}
