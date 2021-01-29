import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, ViewChild } from '@angular/core';

@Directive({ selector: 'calendar-part-container' })
export abstract class CalendarPartContainer implements AfterViewInit {
	@ViewChild('calendarPart')
	calendarPartRef: ElementRef;

	translateXValue: string = 'translateX(0)';

	private calendarPartWidth: number;

	protected constructor(private readonly elementRef: ElementRef,
						  private readonly changeDetectorRef: ChangeDetectorRef) {
	}

	ngAfterViewInit() {
		this.scrollToActiveWeek();
		this.calendarPartWidth = this.elementRef.nativeElement.offsetWidth;
	}

	pan(event): void {
		const offsetPercentage = this.getOffsetPercentage(event.deltaX);

		this.translateXValue = `translateX(${offsetPercentage / 4}%)`;
		this.changeDetectorRef.detectChanges();
	}

	private scrollToActiveWeek(): void {
		this.calendarPartRef.nativeElement.scrollIntoView({ block: 'center' });
	}

	private getOffsetPercentage(offset: number): number {
		return ((offset * 100) / this.calendarPartWidth);
	}
}
