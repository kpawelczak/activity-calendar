import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { CalendarPartContainer } from '../../common/calendar-part-container';
import { ActivityCalendarInterfaceService } from '../top-interface/activity-calendar-interface.service';

@Component({
	selector: 'act-days-container',
	template: `
		<act-calendar-days [weeks]="prevWeeks"></act-calendar-days>

		<act-calendar-days (pan)="onPan($event)"
						   (panend)="onPanEnd()"
						   [selectedDate]="selectedDate"
						   [selectedMonth]="selectedMonth"
						   [monthActivities]="monthActivities"
						   [weeks]="weeks">
		</act-calendar-days>

		<act-calendar-days [weeks]="nextWeeks"></act-calendar-days>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarDaysContainerComponent extends CalendarPartContainer {

	@Input()
	weeks: Array<Array<Date>>;

	@Input()
	prevWeeks: Array<Array<Date>>;

	@Input()
	nextWeeks: Array<Array<Date>>;

	@Input()
	selectedMonth: number;

	@Input()
	monthActivities: Array<any>;

	constructor(interfaceService: ActivityCalendarInterfaceService,
				renderer: Renderer2,
				elementRef: ElementRef,
				changeDetectorRef: ChangeDetectorRef) {
		super(interfaceService, renderer, elementRef, changeDetectorRef);
	}
}
