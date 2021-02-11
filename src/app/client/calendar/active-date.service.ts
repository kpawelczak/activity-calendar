import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FabricDateUtilService } from '../common/date-util/fabric-date-util.service';

@Injectable()
export class ActiveDateService {

	private readonly selectedDate$ = new BehaviorSubject(this.getInitialDate());

	constructor(private readonly dateUtilService: FabricDateUtilService) {
	}

	observeSelectedDate(): Observable<Date> {
		return this.selectedDate$.asObservable();
	}

	dateSelected(date: Date): void {
		this.selectedDate$.next(date);
	}

	private getInitialDate(): Date {
		return this.dateUtilService.getDayStart();
	}
}
