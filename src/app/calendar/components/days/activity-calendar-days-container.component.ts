import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { CalendarPartContainer } from '../../common/calendar-part-container';

@Component({
	selector: 'act-days-container',
	template: `
		<act-calendar-days [weeks]="prevWeeks"></act-calendar-days>

		<act-calendar-days (pan)="onPan($event)"
						   [selectedDate]="selectedDate"
						   [selectedMonth]="selectedMonth"
						   [weeks]="weeks">
		</act-calendar-days>

		<act-calendar-days [weeks]="nextWeeks"></act-calendar-days>
	`,
	host: {
		'[style.transform]': 'translateXValue'
	},
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
	selectedDate: Date;

	@Input()
	selectedMonth: number;

	constructor(elementRef: ElementRef,
				changeDetectorRef: ChangeDetectorRef) {
		super(elementRef, changeDetectorRef);
	}

	onPan(event: any): void {
		this.pan(event);
	}

}
