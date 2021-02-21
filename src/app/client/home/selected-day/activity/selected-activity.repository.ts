import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CalendarActivity } from '../../../../common/models/calendar-activity';

@Injectable()
export class SelectedActivityRepository {

	private readonly activity$ = new Subject<CalendarActivity>();

	onActivity(): Observable<CalendarActivity> {
		return this.activity$.asObservable();
	}

	selectActivity(activity: CalendarActivity): void {
		this.activity$.next(activity);
	}
}
