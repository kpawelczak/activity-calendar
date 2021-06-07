import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivityCalendarView } from './view/activity-calendar-view';

@Injectable()
export class ActivityCalendarViewService {

	private activeView$ = new Subject<ActivityCalendarView>();

	onActiveView(): Observable<ActivityCalendarView> {
		return this.activeView$.asObservable();
	}

	switchView(viewName: ActivityCalendarView): void {
		this.activeView$.next(viewName);
	}

}
