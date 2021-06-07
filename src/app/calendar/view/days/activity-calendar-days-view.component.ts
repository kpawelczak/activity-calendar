import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, Renderer2, ViewEncapsulation } from '@angular/core';
import { CalendarPartContainer } from '../../common/calendar-part-container';
import { ActivityCalendarCardViewService } from '../activity-calendar-card-view.service';
import { CalendarActivity } from '../../../common/models/calendar-activity';

@Component({
	selector: 'ac-days-view',
	template: `
		<ac-calendar-days [weeks]="prevWeeks"></ac-calendar-days>

		<ac-calendar-days (pan)="onPan($event)"
						  (panend)="onPanEnd()"
						  [selectedDate]="selectedDate"
						  [activeMonth]="activeMonth"
						  [monthActivities]="monthActivities"
						  [weeks]="weeks">
		</ac-calendar-days>

		<ac-calendar-days [weeks]="nextWeeks"></ac-calendar-days>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarDaysViewComponent extends CalendarPartContainer {

	@Input()
	weeks: Array<Array<Date>>;

	@Input()
	prevWeeks: Array<Array<Date>>;

	@Input()
	nextWeeks: Array<Array<Date>>;

	@Input()
	monthActivities: Array<CalendarActivity>;

	constructor(interfaceService: ActivityCalendarCardViewService,
				renderer: Renderer2,
				elementRef: ElementRef,
				changeDetectorRef: ChangeDetectorRef) {
		super(interfaceService, renderer, elementRef, changeDetectorRef);
	}
}
