import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivityCalendarViewService } from '../activity-calendar-view.service';
import { ActivityCalendarCardView } from '../common/models/activity-calendar-card-view';
import { ActivityCalendarYears } from '../services/activity-calendar.years';
import { months } from '../common/data/months';
import { ActivityCalendarService } from '../activity-calendar.service';
import { ActivityCalendarYearsService } from '../services/activity-calendar-years.service';
import { Direction } from '../../../../common/icons/arrow-icon/direction';
import { ActivityCalendarView } from '../common/models/activity-calendar-view';
import { Reactive } from '../../../../common/cdk/reactive';
import { ActivityCalendarCardViewService } from './activity-calendar-card-view.service';
import { delay } from 'rxjs/operators';
import { calendarAnimationTimer } from '../common/calendar-animation-timer';
import { DateUtils } from '../../../../common/utils/date-util/date-utils';


@Component({
	selector: 'ac-calendar-view-panel',
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
								[class.disabled]="isNextMonthInFuture(activeYear, activeMonth)"
								(click)="switchCard(FabricCalendarCardView.NEXT)"></gui-arrow-icon>
			</div>

		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarViewPanelComponent extends Reactive implements OnInit {

	@Input()
	fabricCalendarView: ActivityCalendarView;

	@Input()
	selectedDate: Date;

	@Input()
	activeMonth: number;

	@Input()
	activeYear: number;

	@Input()
	years: Array<Array<number>>;

	Direction = Direction;

	FabricCalendarCardView = ActivityCalendarCardView;

	constructor(private readonly calendarViewService: ActivityCalendarViewService,
				private readonly calendarService: ActivityCalendarService,
				private readonly datePickerYearsService: ActivityCalendarYearsService,
				private readonly datePickerYears: ActivityCalendarYears,
				private readonly interfaceService: ActivityCalendarCardViewService) {
		super();
	}

	ngOnInit() {
		this.interfaceService
			.onCardView()
			.pipe(
				delay(calendarAnimationTimer),
				this.takeUntil()
			)
			.subscribe((cardView: ActivityCalendarCardView) => {
				this.switchCard(cardView);
			});
	}

	getDisplayedDate(): string {
		switch (this.fabricCalendarView) {

			case ActivityCalendarView.DAYS:
				return `${months[this.activeMonth]} ${this.activeYear}`;

			case ActivityCalendarView.MONTHS:
				return `${months[this.activeMonth]} ${this.activeYear}`;

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
			activeYear = this.activeYear + inc,
			years =
				next ?
					this.datePickerYears.nextYearRange(this.activeYear)
					: this.datePickerYears.prevYearRange(this.activeYear);

		switch (this.fabricCalendarView) {

			case ActivityCalendarView.DAYS:
				this.handleMonthChange(next);
				break;

			case ActivityCalendarView.MONTHS:
				this.calendarService.selectYear(activeYear);
				break;

			case ActivityCalendarView.YEARS:
				this.datePickerYearsService.next(years);
				break;
		}
	}

	getDisplayedYearRange(): string {
		return this.years[0][0].toString() + '-' + this.years[4][this.years[4].length - 1].toString();
	}

	isNextMonthInFuture(year: number, month: number): boolean {
		return DateUtils.isNextMonthInFuture(year, month);
	}

	private handleMonthChange(next: boolean): void {
		if (next) {
			this.calendarService.nextMonth(this.activeYear, this.activeMonth);
		} else {
			this.calendarService.prevMonth(this.activeYear, this.activeMonth);
		}
	}
}
