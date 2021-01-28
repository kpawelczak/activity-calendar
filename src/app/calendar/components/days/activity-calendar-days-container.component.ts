import {
	AfterViewInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	ElementRef,
	Input,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';

@Component({
	selector: 'act-days-container',
	template: `
		<act-calendar-days [weeks]="prevWeeks"></act-calendar-days>

		<div #activeWeeks>
			<act-calendar-days (pan)="pan($event)"
							   [selectedDate]="selectedDate"
							   [selectedMonth]="selectedMonth"
							   [weeks]="weeks">
			</act-calendar-days>
		</div>

		<act-calendar-days [weeks]="nextWeeks"></act-calendar-days>
	`,
	host: {
		'[style.transform]': 'translateXValue'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityCalendarDaysContainerComponent implements AfterViewInit {

	@ViewChild('activeWeeks')
	activeWeeksRef: ElementRef;

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

	daysContainerWidth: number;

	translateXValue: string = 'translateX(0)';

	constructor(private readonly elementRef: ElementRef,
				private readonly changeDetectorRef: ChangeDetectorRef) {
	}

	ngAfterViewInit() {
		this.scrollToActiveWeek();
		this.daysContainerWidth = this.elementRef.nativeElement.offsetWidth;
	}

	pan(event): void {
		const offsetPercentage = this.getOffsetPercentage(event.deltaX);
		console.log(offsetPercentage);
		this.translateXValue = `translateX(${offsetPercentage}%)`;
		this.changeDetectorRef.detectChanges();
	}

	private scrollToActiveWeek(): void {
		this.activeWeeksRef.nativeElement.scrollIntoView({ block: 'center' });
	}

	private getOffsetPercentage(offset: number): number {
		return ((offset * 100) / this.daysContainerWidth);
	}
}
