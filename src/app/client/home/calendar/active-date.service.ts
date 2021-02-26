import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FabricDateUtilService } from '../../../common/date-util/fabric-date-util.service';
import { ActivitiesRepository } from '../../../services/repositories/activities/activities.repository';
import { CalendarActivity } from '../../../common/models/calendar-activity';

@Injectable()
export class ActiveDateService {

	private readonly selectedDate$ = new BehaviorSubject(this.getInitialDate());

	constructor(private readonly dateUtilService: FabricDateUtilService,
				private readonly activitiesRepository: ActivitiesRepository) {

	}

	observeSelectedDate(): Observable<Date> {
		return this.selectedDate$.asObservable();
	}

	dateSelected(date: Date, activities: Array<CalendarActivity>): void {
		this.activitiesRepository.next(activities);
		this.selectedDate$.next(date);
	}

	reset(): void {
		this.selectedDate$.next(this.getInitialDate());
	}

	private getInitialDate(): Date {
		return this.dateUtilService.getDayStart();
	}
}
