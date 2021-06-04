import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivitiesRepository } from '../../../services/repositories/activities/activities.repository';
import { CalendarActivity } from '../../../common/models/calendar-activity';
import { DateUtils } from '../../../common/utils/date-util/date-utils';

@Injectable()
export class ActiveDateService {

	private selectedDate: Date = this.getInitialDate();

	private readonly selectedDate$ = new BehaviorSubject<Date>(this.selectedDate);

	constructor(private readonly activitiesRepository: ActivitiesRepository) {

	}

	observeSelectedDate(): Observable<Date> {
		return this.selectedDate$.asObservable();
	}

	dateSelected(date: Date, activities: Array<CalendarActivity>): void {
		if (!DateUtils.areDatesSame(this.selectedDate, date)) {
			this.selectedDate = date;
			this.activitiesRepository.next(activities);
			this.selectedDate$.next(date);
		}
	}

	reset(): void {
		this.selectedDate$.next(this.getInitialDate());
	}

	private getInitialDate(): Date {
		return DateUtils.getDayStart();
	}
}
