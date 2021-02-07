import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class FirestoreMonthActivitiesRepository {

	private readonly monthActivities$ = new ReplaySubject<any>(1);


	onMonthActivities(): Observable<any> {
		return this.monthActivities$.asObservable();
	}

	next(activities: any): void {
		this.monthActivities$.next(activities);
	}

}
