import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { monthsPerQuarters } from '../../common/data/months-per-quearters';
import { ActivityCalendarViewService } from '../../activity-calendar-view.service';
import { ActivityCalendarService } from '../../activity-calendar.service';
import { ActivityCalendarView } from '../activity-calendar-view';
import { CalendarPartContainer } from '../../common/calendar-part-container';
import { ActivityCalendarCardViewService } from '../activity-calendar-card-view.service';
import { ActivitiesCount } from '../../../activities/store/count/activities-count';
import { ActivitiesCountMonth } from '../../../activities/store/count/activities-count-month';
import { DateUtils } from '../../../common/utils/date-util/date-utils';

@Component({
	selector: 'ac-calendar-months-view',
	template: `
		<table (pan)="onPan($event)"
			   (panend)="onPanEnd()">
			<tr *ngFor="let quarter of monthsPerQuarters">
				<td (click)="selectMonth(month.nr)"
					*ngFor="let month of quarter"
					[class.disabled]="isDisabled(month.nr)"
					[class.has-activity]="hasActivity(month.nr)"
					[class.gui-date-picker-current-month]="isMonth(currentDay, month.nr)"
					[class.gui-date-picker-selected-month]="isMonth(selectedDate, month.nr)"
					class="gui-date-picker-month">
					<span>
						{{month.name}}
					</span>
				</td>
			</tr>
		</table>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarMonthsViewComponent extends CalendarPartContainer {

	@Input()
	activitiesCount: Array<ActivitiesCount>;

	readonly currentDay: Date = new Date();

	readonly monthsPerQuarters = monthsPerQuarters;

	constructor(private readonly calendarService: ActivityCalendarService,
				private readonly calendarViewService: ActivityCalendarViewService,
				interfaceService: ActivityCalendarCardViewService,
				renderer: Renderer2,
				elementRef: ElementRef,
				changeDetectorRef: ChangeDetectorRef) {
		super(interfaceService, renderer, elementRef, changeDetectorRef);
	}

	isDisabled(month: number): boolean {
		const currentYear = this.currentDay.getFullYear(),
			isYearHigher = this.activeYear > currentYear,
			isYearSame = this.activeYear === this.currentDay.getFullYear(),
			isMonthHigher = month > this.currentDay.getMonth();

		return isYearSame ? isMonthHigher : isYearHigher;
	}

	isMonth(date: Date, month: number): boolean {
		if (date) {
			return DateUtils.isDateInChosenMonth(date, month, this.activeYear);
		}
	}

	selectMonth(month: number): void {
		this.calendarService.selectMonth(month);
		this.calendarViewService.switchView(ActivityCalendarView.DAYS);
	}

	hasActivity(month: number): boolean {
		const yearActivitiesCount = this.activitiesCount
										.find((activitiesCount: ActivitiesCount) => activitiesCount.year === this.activeYear);

		if (!yearActivitiesCount) {
			return;
		}

		const monthActivitiesCount = yearActivitiesCount.months
														.find((activitiesCountMonth: ActivitiesCountMonth) => {
															return activitiesCountMonth.month === month;
														});

		return !!monthActivitiesCount;
	}
}
