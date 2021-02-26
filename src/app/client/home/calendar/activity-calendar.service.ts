import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ActivityCalendarYearMonth } from './common/models/activity-calendar-year-month';

@Injectable()
export class ActivityCalendarService {

	private initialYearMonth = new ActivityCalendarYearMonth(new Date().getMonth(), new Date().getFullYear());

	private year: number;

	private readonly dateYear$ = new ReplaySubject<number>(1);

	private readonly yearMonth$ = new BehaviorSubject<ActivityCalendarYearMonth>(this.initialYearMonth);

	observeDateYear(): Observable<number> {
		return this.dateYear$.asObservable();
	}

	onYearMonth(): Observable<ActivityCalendarYearMonth> {
		return this.yearMonth$.asObservable();
	}

	nextMonth(year: number, month: number): void {
		const isDecember = month === 11,
			newMonth = isDecember ? 0 : month + 1;

		this.year = isDecember ? year + 1 : year;

		this.next(newMonth);
	}

	prevMonth(year: number, month: number): void {
		const isJanuary = month === 0,
			newMonth = isJanuary ? 11 : month - 1;

		this.year = isJanuary ? year - 1 : year;

		this.next(newMonth);
	}

	selectYear(year: number): void {
		this.year = year;
		this.dateYear$.next(year);
	}

	selectMonth(month: number): void {
		this.next(month);
	}

	private next(month: number): void {
		const monthYear = new ActivityCalendarYearMonth(month, this.year);
		this.yearMonth$.next(monthYear);
	}

}
