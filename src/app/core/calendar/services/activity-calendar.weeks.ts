import { Injectable } from '@angular/core';

@Injectable()
export class ActivityCalendarWeeks {

	private weeks: Array<Array<Date>>;

	getDaysInMonths(year: number, month: number): Array<Array<Date>> {
		this.resetWeeks();
		const numberOfDaysInMonth = (new Date(year, month + 1, 0)).getDate();

		for (let i = 1; i <= numberOfDaysInMonth; i++) {
			this.createWeeks(new Date(year, month, i));
		}
		return this.weeks;
	}

	private createWeeks(date: Date): void {
		const day = date.getDate();

		if (this.weeks[0].length === 0 && day === 1) {
			this.createWeek(date, this.weeks[0]);
		}
		if (this.weeks[1].length === 0 && day > this.getLastDayNumber(this.weeks[0])) {
			this.createWeek(this.getLastDayDate(this.weeks[0]), this.weeks[1]);
		}
		if (this.weeks[2].length === 0 && day > this.getLastDayNumber(this.weeks[1])) {
			this.createWeek(this.getLastDayDate(this.weeks[1]), this.weeks[2]);
		}
		if (this.weeks[3].length === 0 && day > this.getLastDayNumber(this.weeks[2])) {
			this.createWeek(this.getLastDayDate(this.weeks[2]), this.weeks[3]);
		}
		if (this.weeks[4].length === 0 && day >= this.getLastDayNumber(this.weeks[3])) {
			this.createWeek(this.getLastDayDate(this.weeks[3]), this.weeks[4]);
		}
		if (this.weeks[5].length === 0 && day >= this.getLastDayNumber(this.weeks[4])) {
			this.createWeek(this.getLastDayDate(this.weeks[4]), this.weeks[5]);
		}

		this.weeks = [this.weeks[0], this.weeks[1], this.weeks[2], this.weeks[3], this.weeks[4], this.weeks[5]];
	}

	private createWeek(date: Date, week: Array<Date>): void {

		for (let i = 1; i <= 7; i++) {
			const isFirstDaySunday = date.getDay() === 0 && this.weeks[0].length === 0;
			let day;

			if (isFirstDaySunday) {
				day = date.getDate() - 6;
			} else {
				day = date.getDate() - date.getDay() + i;
			}
			const dayOfWeek = new Date(date.setDate(day));

			if (week.length < 7) {
				week.push(dayOfWeek);
			}
		}
	}

	private getLastDayNumber(week: Array<Date>): number {
		if (week.length === 7) {
			return week[week.length - 1].getDate();
		}
	}

	private getLastDayDate(week: Array<Date>): Date {
		const lastDay = week[week.length - 1].getDate();
		return new Date(week[week.length - 1].setDate(lastDay));
	}

	private resetWeeks(): void {
		this.weeks = [];
		this.weeks[0] = [];
		this.weeks[1] = [];
		this.weeks[2] = [];
		this.weeks[3] = [];
		this.weeks[4] = [];
		this.weeks[5] = [];
	}
}
