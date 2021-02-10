import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CalendarActivity } from '../firebase/month-activities/calendar-activity';

@Injectable()
export class SelectedDateActivityService {

	private readonly activity$ = new Subject<CalendarActivity>();

	onActivity(): Observable<CalendarActivity> {
		return this.activity$.asObservable();
	}

	next(activity: CalendarActivity): void {
		this.activity$.next(activity);
	}
}
