import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ActiveDateService {

	private readonly selectedDate$ = new BehaviorSubject(this.getInitialDate());

	observeSelectedDate(): Observable<Date> {
		return this.selectedDate$.asObservable();
	}

	dateSelected(date: Date): void {
		this.selectedDate$.next(date);
	}

	private getInitialDate(): Date {
		const date = new Date();
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
	}
}
