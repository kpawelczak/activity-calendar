import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivityCalendarCardView } from '../../common/models/activity-calendar-card-view';

@Injectable()
export class ActivityCalendarInterfaceService {

	private readonly cardSwitch$ = new Subject<ActivityCalendarCardView>();

	onCardSwitch(): Observable<ActivityCalendarCardView> {
		return this.cardSwitch$.asObservable();
	}

	next(calendarCardView: ActivityCalendarCardView): void {
		this.cardSwitch$.next(calendarCardView);
	}

}
