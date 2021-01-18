import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ActiveDateService {

	private initialDate = new Date();

	private selectedDate: Date;

	private readonly selectedDate$ = new BehaviorSubject(this.initialDate);

	observeSelectedDate(): Observable<Date> {
		return this.selectedDate$.asObservable();
	}

	dateSelected(date: Date): void {
		this.selectedDate = new Date(date.getTime());
		this.selectedDate$.next(this.selectedDate);
	}
}
