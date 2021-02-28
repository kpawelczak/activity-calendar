import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FabricDateUtilService } from '../../../common/date-util/fabric-date-util.service';
import { ActivitiesRepository } from '../../../services/repositories/activities/activities.repository';
import { CalendarActivity } from '../../../common/models/calendar-activity';

@Injectable()
export class ActiveDateService {

	private selectedDate: Date = this.getInitialDate();

	private readonly selectedDate$ = new BehaviorSubject<Date>(this.selectedDate);

	constructor(private readonly dateUtilService: FabricDateUtilService,
				private readonly activitiesRepository: ActivitiesRepository) {

	}

	observeSelectedDate(): Observable<Date> {
		return this.selectedDate$.asObservable();
	}

	dateSelected(date: Date, activities: Array<CalendarActivity>): void {
		if (!this.dateUtilService.areDatesSame(this.selectedDate, date)) {
			this.selectedDate = date;
			this.selectedDate$.next(date);
			this.activitiesRepository.next(activities);
		}
	}

	reset(): void {
		this.selectedDate$.next(this.getInitialDate());
	}

	private getInitialDate(): Date {
		return this.dateUtilService.getDayStart();
	}
}
