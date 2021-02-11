import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { CalendarActivity } from './calendar-activity';

@Injectable()
export class FirestoreMonthActivitiesRepository {

	private readonly monthActivities$ = new ReplaySubject<Array<CalendarActivity>>(1);


	onMonthActivities(): Observable<Array<CalendarActivity>> {
		return this.monthActivities$.asObservable();
	}

	next(activities: Array<CalendarActivity>): void {
		this.monthActivities$.next(activities);
	}

}
