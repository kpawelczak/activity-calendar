import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivityCalendarViewService } from '../../activity-calendar-view.service';
import { ActivityCalendarCardView } from '../../common/models/activity-calendar-card-view';
import { ActivityCalendarYears } from '../years/activity-calendar.years';
import { months } from '../../common/data/months';
import { ActivityCalendarService } from '../../activity-calendar.service';
import { ActivityCalendarYearsService } from '../years/activity-calendar-years.service';
import { Direction } from '../../../common/icons/arrow-icon/direction';
import { ActivityCalendarView } from '../../common/models/activity-calendar-view';

@Component({
	selector: 'act-calendar-top-interface',
	template: `
		<div class="gui-date-picker-interface">

			<div (click)="switchCalendarView()"
				 class="gui-date-picker-interface-date">
				{{getDisplayedDate()}}
			</div>

			<div class="gui-date-picker-arrows">
				<gui-arrow-icon [direction]="Direction.LEFT"
								(click)="switchCard(FabricCalendarCardView.PREV)"></gui-arrow-icon>
				<gui-arrow-icon [direction]="Direction.RIGHT"
								(click)="switchCard(FabricCalendarCardView.NEXT)"></gui-arrow-icon>
			</div>

		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarTopInterfaceComponent {

	@Input()
	fabricCalendarView: ActivityCalendarView;

	@Input()
	selectedDate: Date;

	@Input()
	selectedMonth: number;

	@Input()
	selectedYear: number;

	@Input()
	years: Array<Array<number>>;

	Direction = Direction;

	FabricCalendarCardView = ActivityCalendarCardView;

	constructor(private readonly calendarViewService: ActivityCalendarViewService,
				private readonly calendarService: ActivityCalendarService,
				private readonly datePickerYearsService: ActivityCalendarYearsService,
				private readonly datePickerYears: ActivityCalendarYears) {

	}

	getDisplayedDate(): string {
		switch (this.fabricCalendarView) {

			case ActivityCalendarView.DAYS:
				return `${months[this.selectedMonth]} ${this.selectedYear}`;

			case ActivityCalendarView.MONTHS:
				return `${months[this.selectedMonth]} ${this.selectedYear}`;

			case ActivityCalendarView.YEARS:
				return `${this.getDisplayedYearRange()}`;
		}

	}

	switchCalendarView(): void {
		switch (this.fabricCalendarView) {

			case ActivityCalendarView.DAYS:
				this.calendarViewService.switchView(ActivityCalendarView.YEARS);
				break;

			case ActivityCalendarView.MONTHS:
				this.calendarViewService.switchView(ActivityCalendarView.DAYS);
				break;

			case ActivityCalendarView.YEARS:
				this.calendarViewService.switchView(ActivityCalendarView.DAYS);
				break;
		}
	}

	switchCard(cardView: ActivityCalendarCardView): void {
		const next = cardView === ActivityCalendarCardView.NEXT,
			inc = next ? 1 : -1,
			selectedYear = this.selectedYear + inc,
			years = next ?
				this.datePickerYears.nextYearRange(this.selectedYear)
				: this.datePickerYears.prevYearRange(this.selectedYear);

		switch (this.fabricCalendarView) {

			case ActivityCalendarView.DAYS:
				this.handleMonthChange(next);
				break;

			case ActivityCalendarView.MONTHS:
				this.calendarService.selectYear(selectedYear);
				break;

			case ActivityCalendarView.YEARS:
				this.datePickerYearsService.next(years);
				break;
		}
	}

	getDisplayedYearRange(): string {
		return this.years[0][0].toString() + '-' + this.years[4][this.years[4].length - 1].toString();
	}

	private handleMonthChange(next: boolean): void {
		if (next) {
			this.calendarService.nextMonth(this.selectedYear, this.selectedMonth);
		} else {
			this.calendarService.prevMonth(this.selectedYear, this.selectedMonth);
		}
	}
}
