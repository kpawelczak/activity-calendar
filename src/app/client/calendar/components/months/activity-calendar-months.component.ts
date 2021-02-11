import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { quarters } from '../../common/data/quarters';
import { ActivityCalendarViewService } from '../../activity-calendar-view.service';
import { ActivityCalendarService } from '../../activity-calendar.service';
import { FabricDateUtilService } from '../../../common/date-util/fabric-date-util.service';
import { ActivityCalendarView } from '../../common/models/activity-calendar-view';
import { CalendarPartContainer } from '../../common/calendar-part-container';
import { ActivityCalendarInterfaceService } from '../top-interface/activity-calendar-interface.service';

@Component({
	selector: 'act-calendar-months',
	template: `
		<table (pan)="onPan($event)"
			   (panend)="onPanEnd()">
			<tr *ngFor="let quarter of quarters">
				<td (click)="selectMonth(month.nr)"
					*ngFor="let month of quarter"
					[class.disabled]="isDisabled(month.nr)"
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
	selectedDate: Date;

	@Input()
	selectedYear: number;

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
			isYearHigher = this.selectedYear > currentYear,
			isYearSame = this.selectedYear === this.currentDay.getFullYear(),
			isMonthHigher = month > this.currentDay.getMonth();

		return isYearSame ? isMonthHigher : isYearHigher;
	}

	isMonth(date: Date, month: number): boolean {
		if (date) {
			return this.dateUtilsService.isMonth(date, month, this.selectedYear);
		}
	}

	selectMonth(month: number): void {
		this.calendarService.selectMonth(month);
		this.calendarViewService.switchView(ActivityCalendarView.DAYS);
	}
}
