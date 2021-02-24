import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { CalendarActivity } from '../../../common/models/calendar-activity';

@Injectable()
export class ActivitiesRepository {

	private monthActivities: Array<CalendarActivity>;

	private readonly monthActivities$ = new BehaviorSubject<Array<CalendarActivity>>(null);

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
			return activity.getActivityUUID() === calendarActivity.getActivityUUID() ? activity : calendarActivity;
		});
		this.monthActivities$.next(this.monthActivities);
	}

	deleteActivity(activity: CalendarActivity): void {
		this.monthActivities = this.monthActivities
								   .filter((calendarActivity: CalendarActivity) => {
									   return calendarActivity.getActivityUUID() !== activity.getActivityUUID();
								   });

		this.monthActivities$.next(this.monthActivities);
	}

	reset(): void {
		this.monthActivities = [];
		this.monthActivities$.next([]);
	}

}
