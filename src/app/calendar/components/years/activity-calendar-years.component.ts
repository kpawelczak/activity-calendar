import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivityCalendarService } from '../../activity-calendar.service';
import { ActivityCalendarViewService } from '../../activity-calendar-view.service';
import { ActivityCalendarView } from '../../models/activity-calendar-view';

@Component({
	selector: 'act-calendar-years',
	template: `
		<table>
			<tr *ngFor="let yearsChunk of years">
				<td (click)="selectYear(year)"
					*ngFor="let year of yearsChunk"
					[class.gui-date-picker-current-year]="isYear(currentDay, year)"
					[class.gui-date-picker-selected-year]="isYear(selectedDate, year)"
					class="gui-date-picker-year">
					<span>
						{{year}}
					</span>
				</td>
			</tr>
		</table>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarYearsComponent {

	@Input()
	selectedDate: Date;

	@Input()
	years: Array<Array<number>>;

	currentDay: Date = new Date();

	constructor(private readonly calendarService: ActivityCalendarService,
				private readonly calendarViewService: ActivityCalendarViewService) {
	}

	selectYear(year: number): void {
		this.calendarService.selectYear(year);
		this.calendarViewService.switchView(ActivityCalendarView.MONTHS);
	}

	isYear(date: Date, year: number): boolean {
		if (date) {
			return date.getFullYear() === year;
		}
	}
}
