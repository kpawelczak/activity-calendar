import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';

@Injectable()
export class MonthActivitiesRepository { // todo not firestore

	private monthActivities: Array<CalendarActivity>;

	private readonly monthActivities$ = new ReplaySubject<Array<CalendarActivity>>(1);

	onMonthActivities(): Observable<Array<CalendarActivity>> {
		return this.monthActivities$.asObservable();
	}

	next(activities: Array<CalendarActivity>): void {
		this.monthActivities = activities;
		this.monthActivities$.next(activities);
	}

	addMonthActivity(activity: CalendarActivity): void {
		this.monthActivities.push(activity);
		this.monthActivities$.next(this.monthActivities);
	}

	updateMonthActivities(activity: CalendarActivity): void {
		this.monthActivities = this.monthActivities.map((calendarActivity: CalendarActivity) => {
			return activity.UUID === calendarActivity.UUID ? activity : calendarActivity;
		});
		this.monthActivities$.next(this.monthActivities);
	}

	deleteActivity(activity: CalendarActivity): void {
		this.monthActivities = this.monthActivities
								   .filter((calendarActivity: CalendarActivity) => {
									   return calendarActivity.UUID !== activity.UUID;
								   });

		this.monthActivities$.next(this.monthActivities);
	}

}
