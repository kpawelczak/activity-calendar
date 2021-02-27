import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { quarters } from '../../common/data/quarters';
import { ActivityCalendarViewService } from '../../activity-calendar-view.service';
import { ActivityCalendarService } from '../../activity-calendar.service';
import { FabricDateUtilService } from '../../../../../common/date-util/fabric-date-util.service';
import { ActivityCalendarView } from '../../common/models/activity-calendar-view';
import { CalendarPartContainer } from '../../common/calendar-part-container';
import { ActivityCalendarInterfaceService } from '../top-interface/activity-calendar-interface.service';
import { ActivitiesCount } from '../../../../../common/models/activities-count';
import { ActivitiesCountMonth } from '../../../../../common/models/activities-count-month';

@Component({
	selector: 'ac-calendar-months',
	template: `
		<table (pan)="onPan($event)"
			   (panend)="onPanEnd()">
			<tr *ngFor="let quarter of quarters">
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
export class ActivityCalendarMonthsComponent extends CalendarPartContainer {

	@Input()
	activeYear: number;

	@Input()
	activitiesCount: Array<ActivitiesCount>;

	quarters = quarters;

	currentDay: Date = new Date();

	constructor(private readonly dateUtilsService: FabricDateUtilService,
				private readonly calendarService: ActivityCalendarService,
				private readonly calendarViewService: ActivityCalendarViewService,
				interfaceService: ActivityCalendarInterfaceService,
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
			return this.dateUtilsService.isDateInChosenMonth(date, month, this.activeYear);
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
