import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CalendarActivity } from './calendar-activity';

@Injectable()
export class FirestoreMonthActivitiesRepository { // todo not firestore

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

	updateMonthActivities(): void {

	}

}
