import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CalendarActivity } from '../../../../firebase/activities/month-activities/calendar-activity';

@Injectable()
export class SelectedDayActivitiesRepository {

	private monthActivities: Array<CalendarActivity>;

	private readonly activities$ = new ReplaySubject<Array<CalendarActivity>>(1);

	onActivities(): Observable<Array<CalendarActivity>> {
		return this.activities$.asObservable();
	}

	selectDayActivities(day: Date): void {
		const dayActivities = this.monthActivities
								  .filter((calendarActivity: CalendarActivity) => {
									  return calendarActivity.day === day.getTime();
								  });

		this.activities$.next(dayActivities);
	}

	setMonthActivities(monthActivities: Array<CalendarActivity>): void {
		this.monthActivities = monthActivities;
	}
}
