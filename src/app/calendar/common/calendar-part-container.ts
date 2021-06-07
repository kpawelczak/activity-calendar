import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { ActivityCalendarCardViewService } from '../view/activity-calendar-card-view.service';
import { ActivityCalendarCardView } from './models/activity-calendar-card-view';
import { Reactive } from '../../common/cdk/reactive';
import { timer } from 'rxjs';
import { calendarAnimationTimer } from './calendar-animation-timer';
import { DateUtils } from '../../common/utils/date-util/date-utils';

@Directive({ selector: 'calendar-part-container' })
export abstract class CalendarPartContainer extends Reactive implements AfterViewInit {

	@Input()
	selectedDate: Date;

	@Input()
	activeMonth: number;

	@Input()
	activeYear: number;

	private offsetPercentage: number;

	private calendarPartWidth: number;

	protected constructor(private readonly interfaceService: ActivityCalendarCardViewService,
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

		if (DateUtils.isNextMonthInFuture(this.activeYear, this.activeMonth)) {
			if (this.offsetPercentage < -30) {
				this.offsetPercentage = 30;
				return;
			}
		}

		if (Math.abs(this.offsetPercentage) > 50) {
			return;
		}

		this.setOffset(this.offsetPercentage / 2);
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
