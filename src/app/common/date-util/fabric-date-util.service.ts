import { Injectable } from '@angular/core';

@Injectable()
export class FabricDateUtilService {

	areDatesSame(firstDay: Date, secondDate: Date): boolean {
		return firstDay.getDate() === secondDate.getDate() &&
			firstDay.getMonth() === secondDate.getMonth() &&
			firstDay.getFullYear() === secondDate.getFullYear();
	}

	isDateInChosenMonth(date: Date, month: number, year: number): boolean {
		return date.getMonth() === month &&
			date.getFullYear() === year;
	}

	isFuture(date: Date): boolean {
		const currentDateString = new Date().getTime(),
			dateString = date.getTime();

		return dateString > currentDateString;
	}

	isNextMonthInFuture(year: number, month: number): boolean {
		const nextMonth = month + 1,
			nextMonthDate = new Date(year, nextMonth, 1);

		return this.isFuture(nextMonthDate);
	}

	getDayStart(): Date {
		const date = new Date();
		return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
	}
}
