import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { daysOfTheWeek } from '../../common/data/days-of-the-week';
import { ActiveDateService } from '../../active-date.service';
import { FabricDateUtilService } from '../../../common/date-util/fabric-date-util.service';

@Component({
	selector: 'act-calendar-days',
	template: `
		<table>
			<thead class="gui-date-picker-header">
			<tr>
				<th *ngFor="let dayOfTheWeek of daysOfTheWeek">
					<span>{{dayOfTheWeek}}</span>
				</th>
			</tr>
			</thead>

			<tr *ngFor="let week of weeks">

				<td *ngFor="let day of week"
					[class.disabled]="isDisabled(day)"
					[class.gui-date-picker-current-day]="isDate(currentDay, day)"
					[class.gui-date-picker-selected-day]="isDate(selectedDate, day)"
					[class.gui-date-picker-selected-month]="displayMonthDays(day.getMonth())"
					[class.has-activity]="hasActivity(day)"
					class="gui-date-picker-day">
					<span (click)="selectDate(day)">
						{{day.getDate()}}
					</span>
				</td>

			</tr>
		</table>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarDaysComponent {

	@Input()
	monthActivities: Array<any>;

	@Input()
	selectedDate: Date;

	@Input()
	selectedMonth: number;

	@Input()
	weeks: Array<Array<Date>>;

	daysOfTheWeek = daysOfTheWeek;

	currentDay: Date = new Date();

	constructor(private readonly dateUtilsService: FabricDateUtilService,
				private readonly datePickerService: ActiveDateService) {
	}

	isDisabled(day: Date): boolean {
		return this.dateUtilsService.isFuture(day);
	}

	selectDate(date: Date): void {
		this.datePickerService.dateSelected(date);
	}

	isDate(comparedDate: Date, date: Date): boolean {
		if (comparedDate) {
			return this.dateUtilsService.areDatesSame(comparedDate, date);
		}
	}

	displayMonthDays(day: number): boolean {
		return day === this.selectedMonth;
	}

	hasActivity(day: Date): boolean {
		const dayInMilliSeconds = day.getTime();
		let hasActivity = false;

		this.monthActivities?.forEach((activity: any) => {

			if (activity.day === dayInMilliSeconds) {
				hasActivity = true;
			}
		});

		return hasActivity;
	}
}
