import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Renderer2 } from '@angular/core';
import { ActivityCalendarInterfaceService } from '../components/top-interface/activity-calendar-interface.service';
import { ActivityCalendarCardView } from './models/activity-calendar-card-view';
import { Reactive } from '../../../common/reactive';
import { timer } from 'rxjs';
import { calendarAnimationTimer } from './calendar-animation-timer';

@Directive({ selector: 'calendar-part-container' })
export abstract class CalendarPartContainer extends Reactive implements AfterViewInit {

	private offsetPercentage: number;

	private calendarPartWidth: number;

	protected constructor(private readonly interfaceService: ActivityCalendarInterfaceService,
						  private readonly renderer: Renderer2,
						  private readonly elementRef: ElementRef,
						  private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngAfterViewInit() {
		timer(500)
			.pipe(this.takeUntil())
			.subscribe(() => {
				this.calendarPartWidth = this.elementRef.nativeElement.offsetWidth;
			});
	}

	onPanEnd(): void {
		this.addTransitionStyle();

		switch (true) {

			case this.offsetPercentage > 40: {
				this.interfaceService.next(ActivityCalendarCardView.PREV);
				this.setOffset(this.calendarPartWidth, true);
				break;
			}

			case this.offsetPercentage < -40: {
				this.interfaceService.next(ActivityCalendarCardView.NEXT);
				this.setOffset(-this.calendarPartWidth, true);
				break;
			}

			default:
				this.setOffset(0);
		}

	}

	onPan(event): void {

		this.offsetPercentage = this.getOffsetPercentage(event.deltaX);

		if (Math.abs(this.offsetPercentage) > 150) {
			return;
		}

		this.setOffset(this.offsetPercentage / 4);
		this.detectChanges();
	}

	protected detectChanges(): void {
		this.changeDetectorRef.detectChanges();
	}

	private getOffsetPercentage(offset: number): number {
		return ((offset * 100) / this.calendarPartWidth);
	}

	private setOffset(offset: number, pixels?: boolean): void {
		const offsetValueType = pixels ? 'px' : '%';
		this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translateX(${offset + offsetValueType})`);
	}

	private addTransitionStyle(): void {
		this.renderer.setStyle(this.elementRef.nativeElement,
			'transition',
			`transform ${calendarAnimationTimer}ms ease-out`);

		timer(calendarAnimationTimer)
			.pipe(this.takeUntil())
			.subscribe(() => {
				this.renderer.removeStyle(this.elementRef.nativeElement, 'transition');
				this.setOffset(0);
			});
	}
}
