import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CalendarActivity } from '../../../../common/models/calendar-activity';

@Injectable()
export class SelectedDayActivitiesRepository {

	private activities: Array<CalendarActivity>;

	private readonly activities$ = new ReplaySubject<Array<CalendarActivity>>(1);

	onActivities(): Observable<Array<CalendarActivity>> {
		return this.activities$.asObservable();
	}

	selectDayActivities(day: Date): void {
		const dayActivities = this.activities
								  .filter((calendarActivity: CalendarActivity) => {
									  return calendarActivity.day === day.getTime();
								  });

		this.activities$.next(dayActivities);
	}

	setMonthActivities(activities: Array<CalendarActivity>): void {
		this.activities = activities;
	}
}
