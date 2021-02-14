import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';

@Injectable()
export class SelectedDateActivityService {

	private monthActivities: Array<CalendarActivity>;

	private readonly activities$ = new Subject<Array<CalendarActivity>>();

	private readonly activity$ = new Subject<CalendarActivity>();

	onActivity(): Observable<CalendarActivity> {
		return this.activity$.asObservable();
	}

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

	selectActivity(activity: CalendarActivity): void {
		this.activity$.next(activity);
	}

	setMonthActivities(monthActivities: Array<CalendarActivity>): void {
		this.monthActivities = monthActivities;
	}

}
