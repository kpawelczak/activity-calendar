import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	OnInit,
	Output,
	ViewEncapsulation
} from '@angular/core';
import { ActiveDateService } from './active-date.service';
import { ActivityCalendarWeeks } from './services/activity-calendar.weeks';
import { ActivityCalendarYears } from './services/activity-calendar.years';
import { ActivityCalendarViewService } from './activity-calendar-view.service';
import { ActivityCalendarService } from './activity-calendar.service';
import { ActivityCalendarYearsService } from './services/activity-calendar-years.service';
import { Reactive } from '../../common/cdk/reactive';
import { ActivityCalendarView } from './view/activity-calendar-view';
import { CalendarActivity } from '../activities/store/activities/calendar-activity';
import { pairwise, startWith } from 'rxjs/operators';
import { ActiveMonth } from './active-month';
import { ActivitiesCount } from '../activities/store/count/activities-count';


@Component({
	selector: 'ac-calendar',
	templateUrl: 'activity-calendar.component.html',
	host: {
		'[class.gui-date-picker-calendar]': 'true'
	},
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None
})
export class ActivityCalendarComponent extends Reactive implements OnInit {

	@Input()
	monthActivities: Array<CalendarActivity>;

	@Input()
	activitiesCount: Array<ActivitiesCount>;

	@Output()
	onMonthChange = new EventEmitter();

	@Output()
	onSelectedDayActivities = new EventEmitter();

	prevWeeks: Array<Array<Date>>;

	weeks: Array<Array<Date>>;

	nextWeeks: Array<Array<Date>>;

	years: Array<Array<number>>;

	selectedDate: Date;

	activeMonth: number;

	activeYear: number;

	ActivityCalendarView = ActivityCalendarView;

	activityCalendarView: ActivityCalendarView = ActivityCalendarView.DAYS;

	constructor(private readonly datePickerService: ActiveDateService,
				private readonly datePickerWeeks: ActivityCalendarWeeks,
				private readonly datePickerYears: ActivityCalendarYears,
				private readonly datePickerYearsService: ActivityCalendarYearsService,
				private readonly calendarService: ActivityCalendarService,
				private readonly calendarViewService: ActivityCalendarViewService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.datePickerService
			.observeSelectedDate()
			.pipe(this.takeUntil())
			.subscribe((date: Date) => {
				this.selectedDate = date;
				this.changeDetectorRef.detectChanges();
			});

		this.calendarService
			.onActiveMonth()
			.pipe(
				startWith(new ActiveMonth(-1, -1)),
				pairwise(),
				this.takeUntil())
			.subscribe(([prevActiveMonth, activeMonth]: [ActiveMonth, ActiveMonth]) => {
				this.activeYear = activeMonth.year;
				this.activeMonth = activeMonth.month;
				this.calculateDatePickerData();

				if (this.didActiveMonthChange(prevActiveMonth, activeMonth)) {
					this.onMonthChange.emit(activeMonth);
				}

				this.changeDetectorRef.detectChanges();
			});

		this.calendarService
			.onActiveYear()
			.pipe(this.takeUntil())
			.subscribe((year: number) => {
				this.activeYear = year;
				this.changeDetectorRef.detectChanges();
			});

		this.datePickerYearsService
			.onYears()
			.pipe(this.takeUntil())
			.subscribe((years: Array<Array<number>>) => {
				this.years = years;
				this.changeDetectorRef.detectChanges();
			});

		this.calendarViewService
			.onActiveView()
			.pipe(this.takeUntil())
			.subscribe((fabricCalendarView: ActivityCalendarView) => {
				this.activityCalendarView = fabricCalendarView;

				if (fabricCalendarView === ActivityCalendarView.DAYS) {
					this.calendarService.next();
				}

				this.changeDetectorRef.detectChanges();
			});

	}

	getCalendarView(): ActivityCalendarView {
		if (event) {
			event.stopPropagation();
		}
		return this.activityCalendarView;
	}

	private calculateDatePickerData(): void {
		this.weeks = this.datePickerWeeks.getDaysInMonths(this.activeYear, this.activeMonth);
		this.prevWeeks = this.datePickerWeeks.getDaysInMonths(this.activeYear, this.activeMonth - 1);
		this.nextWeeks = this.datePickerWeeks.getDaysInMonths(this.activeYear, this.activeMonth + 1);

		this.years = this.datePickerYears.getYears(this.activeYear);
	}

	private didActiveMonthChange(prevActiveMonth: ActiveMonth, nextActiveMonth: ActiveMonth): boolean {
		return JSON.stringify(prevActiveMonth) !== JSON.stringify(nextActiveMonth);
	}
}
