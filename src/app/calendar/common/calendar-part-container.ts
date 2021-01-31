import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, Renderer2 } from '@angular/core';
import { ActivityCalendarInterfaceService } from '../components/top-interface/activity-calendar-interface.service';
import { ActivityCalendarCardView } from './models/activity-calendar-card-view';
import { Reactive } from '../../common/reactive';
import { timer } from 'rxjs';

@Directive({ selector: 'calendar-part-container' })
export abstract class CalendarPartContainer extends Reactive implements AfterViewInit {

	private static readonly TRANSITION_MILLISECONDS = 200;

	private offsetPercentage: number;

	private calendarPartWidth: number;

	protected constructor(private readonly interfaceService: ActivityCalendarInterfaceService,
						  private readonly renderer: Renderer2,
						  private readonly elementRef: ElementRef,
						  private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngAfterViewInit() {
		this.calendarPartWidth = this.elementRef.nativeElement.offsetWidth;
	}

	onPanEnd(): void {
		this.addTransitionClass();
		if (this.offsetPercentage > 80) {
			this.interfaceService.next(ActivityCalendarCardView.PREV);
			this.setOffset(-50);
		}

		if (this.offsetPercentage < -80) {
			this.interfaceService.next(ActivityCalendarCardView.NEXT);
			this.setOffset(50);
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

	private setOffset(offset: number): void {
		this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translateX(${offset}%)`);
	}

	private addTransitionClass(): void {
		this.renderer.setStyle(this.elementRef.nativeElement,
			'transition',
			`transform ${CalendarPartContainer.TRANSITION_MILLISECONDS}ms ease-in-out`);

		timer(CalendarPartContainer.TRANSITION_MILLISECONDS)
			.pipe(this.takeUntil())
			.subscribe(() => {
				this.renderer.removeStyle(this.elementRef.nativeElement, 'transition');
				this.setOffset(0);
			});
	}
}
