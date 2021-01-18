import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ActivityCalendarService {

	private readonly dateMonth$ = new Subject<number>();

	private readonly dateYear$ = new Subject<number>();

	observeDateMonth(): Observable<number> {
		return this.dateMonth$.asObservable();
	}

	observeDateYear(): Observable<number> {
		return this.dateYear$.asObservable();
	}

	nextMonth(year: number, month: number): void {
		if (month === 11) {
			this.dateYear$.next(year + 1);
			this.selectMonth(0);
		} else {
			this.selectMonth(month + 1);
		}
	}

	prevMonth(year: number, month: number): void {
		if (month === 0) {
			this.dateYear$.next(year - 1);
			this.selectMonth(11);
		} else {
			this.selectMonth(month - 1);
		}
	}

	selectYear(year: number): void {
		this.dateYear$.next(year);
	}

	selectMonth(month: number): void {
		this.dateMonth$.next(month);
	}
}