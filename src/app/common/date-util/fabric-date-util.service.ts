import { Injectable } from '@angular/core';

@Injectable()
export class FabricDateUtilService {

	areDatesSame(firstDay: Date, secondDate: Date): boolean {
		return firstDay.getDate() === secondDate.getDate() &&
			firstDay.getMonth() === secondDate.getMonth() &&
			firstDay.getFullYear() === secondDate.getFullYear();
	}

	isMonth(date: Date, month: number, year: number): boolean {
		return date.getMonth() === month &&
			date.getFullYear() === year;
	}

	isFuture(date: Date): boolean {
		const currentDateString = new Date().getTime(),
			dateString = date.getTime();

		return dateString > currentDateString;
	}
}
