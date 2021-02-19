import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { ActivityCalendarService } from '../../activity-calendar.service';
import { ActivityCalendarViewService } from '../../activity-calendar-view.service';
import { ActivityCalendarView } from '../../common/models/activity-calendar-view';
import { CalendarPartContainer } from '../../common/calendar-part-container';
import { ActivityCalendarInterfaceService } from '../top-interface/activity-calendar-interface.service';

@Component({
	selector: 'act-calendar-years',
	template: `
		<table (pan)="onPan($event)"
			   (panend)="onPanEnd()">
			<tr *ngFor="let yearsChunk of years">
				<td (click)="selectYear(year)"
					*ngFor="let year of yearsChunk"
					[class.disabled]="isDisabled(year)"
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
export class ActivityCalendarYearsComponent extends CalendarPartContainer {

	@Input()
	years: Array<Array<number>>;

	currentDay: Date = new Date();

	constructor(private readonly calendarService: ActivityCalendarService,
				private readonly calendarViewService: ActivityCalendarViewService,
				interfaceService: ActivityCalendarInterfaceService,
				renderer: Renderer2,
				elementRef: ElementRef,
				changeDetectorRef: ChangeDetectorRef) {
		super(interfaceService, renderer, elementRef, changeDetectorRef);
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

	isDisabled(year: number): boolean {
		return year > this.currentDay.getFullYear();
	}

}