import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { ActiveMonth } from './common/models/activity-calendar-year-month';

@Injectable()
export class ActivityCalendarService {

	private initialActiveMonth = new ActiveMonth(new Date().getMonth(), new Date().getFullYear());

	private year: number;

	private readonly activeYear$ = new ReplaySubject<number>(1);

	private readonly activeMonth$ = new BehaviorSubject<ActiveMonth>(this.initialActiveMonth);

	onActiveYear(): Observable<number> {
		return this.activeYear$.asObservable();
	}

	onActiveMonth(): Observable<ActiveMonth> {
		return this.activeMonth$.asObservable();
	}

	nextMonth(year: number, month: number): void {
		const isDecember = month === 11,
			newMonth = isDecember ? 0 : month + 1;

		this.year = isDecember ? year + 1 : year;

		this.nextActiveMonth(newMonth);
	}

	prevMonth(year: number, month: number): void {
		const isJanuary = month === 0,
			newMonth = isJanuary ? 11 : month - 1;

		this.year = isJanuary ? year - 1 : year;

		this.nextActiveMonth(newMonth);
	}

	selectYear(year: number): void {
		this.year = year;
		this.activeYear$.next(year);
	}

	selectMonth(month: number): void {
		this.nextActiveMonth(month);
	}

	private nextActiveMonth(month: number): void {
		const monthYear = new ActiveMonth(month, this.year);
		this.activeMonth$.next(monthYear);
	}

}
