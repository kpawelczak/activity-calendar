import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

import { daysOfTheWeek } from '../../common/data/days-of-the-week';
import { ActiveDateService } from '../../active-date.service';
import { FabricDateUtilService } from '../../../../../common/date-util/fabric-date-util.service';
import { CalendarActivity } from '../../../../../common/models/calendar-activity';

@Component({
	selector: 'ac-calendar-days',
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
	monthActivities: Array<CalendarActivity>;

	@Input()
	selectedDate: Date;

	@Input()
	activeMonth: number;

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
		this.datePickerService.dateSelected(date, this.monthActivities);
	}

	isDate(comparedDate: Date, date: Date): boolean {
		if (comparedDate) {
			return this.dateUtilsService.areDatesSame(comparedDate, date);
		}
	}

	displayMonthDays(month: number): boolean {
		return month === this.activeMonth;
	}

	hasActivity(day: Date): boolean {
		const dayInMilliSeconds = day.getTime(),
			dayActivity = this.monthActivities?.find((activity: CalendarActivity) => activity.day === dayInMilliSeconds);

		return !!dayActivity;
	}
}
