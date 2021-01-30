import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef } from '@angular/core';

@Directive({ selector: 'calendar-part-container' })
export abstract class CalendarPartContainer implements AfterViewInit {

	translateXValue: string = 'translateX(0)';

	private calendarPartWidth: number;

	protected constructor(private readonly elementRef: ElementRef,
						  private readonly changeDetectorRef: ChangeDetectorRef) {
	}

	ngAfterViewInit() {
		this.calendarPartWidth = this.elementRef.nativeElement.offsetWidth;
	}

	protected pan(event): void {
		const offsetPercentage = this.getOffsetPercentage(event.deltaX);

		this.translateXValue = `translateX(${offsetPercentage / 4}%)`;
		this.detectChanges();
	}

	protected detectChanges(): void {
		this.changeDetectorRef.detectChanges();
	}

	private getOffsetPercentage(offset: number): number {
		return ((offset * 100) / this.calendarPartWidth);
	}
}
