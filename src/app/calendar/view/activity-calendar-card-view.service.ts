import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivityCalendarCardView } from '../common/models/activity-calendar-card-view';

@Injectable()
export class ActivityCalendarCardViewService {

	private readonly cardView$ = new Subject<ActivityCalendarCardView>();

	onCardView(): Observable<ActivityCalendarCardView> {
		return this.cardView$.asObservable();
	}

	next(calendarCardView: ActivityCalendarCardView): void {
		this.cardView$.next(calendarCardView);
	}

}
