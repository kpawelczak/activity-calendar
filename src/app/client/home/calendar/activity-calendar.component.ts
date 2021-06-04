import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from './active-date.service';
import { ActivityCalendarWeeks } from './services/activity-calendar.weeks';
import { ActivityCalendarYears } from './services/activity-calendar.years';
import { ActivityCalendarViewService } from './activity-calendar-view.service';
import { ActivityCalendarService } from './activity-calendar.service';
import { ActivityCalendarYearsService } from './services/activity-calendar-years.service';
import { Reactive } from '../../../common/cdk/reactive';
import { ActivityCalendarView } from './common/models/activity-calendar-view';
import { FirebaseActivitiesService } from '../../../services/firebase/activities/activities/firebase-activities.service';
import { CalendarActivity } from '../../../common/models/calendar-activity';
import { filter, pairwise, skip, startWith, switchMap } from 'rxjs/operators';
import { ActiveMonth } from './common/models/activity-calendar-year-month';
import { FirebaseActivitiesCountService } from '../../../services/firebase/activities/activities-count/firebase-activities-count.service';
import { ActivitiesCountRepository } from '../../../services/repositories/activities/count/activities-count.repository';
import { EMPTY } from 'rxjs';
import { ActivitiesCount } from '../../../common/models/activities-count';
import { ActivitiesRepository } from '../../../services/repositories/activities/activities.repository';
import { DateUtils } from '../../../common/utils/date-util/date-utils';


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

	prevWeeks: Array<Array<Date>>;

	weeks: Array<Array<Date>>;

	nextWeeks: Array<Array<Date>>;

	years: Array<Array<number>>;

	selectedDate: Date;

	activeMonth: number;

	activeYear: number;

	ActivityCalendarView = ActivityCalendarView;

	activityCalendarView: ActivityCalendarView = ActivityCalendarView.DAYS;

	monthActivities: Array<CalendarActivity>;

	activitiesCount: Array<ActivitiesCount>;

	constructor(private readonly datePickerService: ActiveDateService,
				private readonly datePickerWeeks: ActivityCalendarWeeks,
				private readonly datePickerYears: ActivityCalendarYears,
				private readonly datePickerYearsService: ActivityCalendarYearsService,
				private readonly calendarService: ActivityCalendarService,
				private readonly calendarViewService: ActivityCalendarViewService,
				private readonly firebaseActivitiesService: FirebaseActivitiesService,
				private readonly firebaseActivitiesCountService: FirebaseActivitiesCountService,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly activitiesCountRepository: ActivitiesCountRepository,
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
				switchMap(([prevActiveMonth, activeMonth]) => {
					this.activeYear = activeMonth.year;
					this.activeMonth = activeMonth.month;
					this.calculateDatePickerData();
					this.changeDetectorRef.detectChanges();

					return this.didActiveMonthChange(prevActiveMonth, activeMonth) ?
						this.firebaseActivitiesService.getMonthActivities(this.activeYear, this.activeMonth)
						: EMPTY;
				}),
				this.takeUntil())
			.subscribe((calendarActivities: Array<CalendarActivity>) => {
				this.monthActivities = calendarActivities;
				this.changeDetectorRef.detectChanges();
			});

		this.activitiesRepository
			.onMonthActivities()
			.pipe(
				filter(() =>
					DateUtils.isDateInChosenMonth(this.selectedDate, this.activeMonth, this.activeYear)
				),
				skip(1),
				this.takeUntil())
			.subscribe((calendarActivities: Array<CalendarActivity>) => {
				this.monthActivities = calendarActivities;
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

		this.activitiesCountRepository
			.onActivitiesCount()
			.pipe(
				switchMap((activitiesCount: Array<ActivitiesCount>) => {
					const isActivitiesCountStored = !!activitiesCount;

					if (isActivitiesCountStored) {
						this.activitiesCount = activitiesCount;
						this.changeDetectorRef.detectChanges();
					}

					return isActivitiesCountStored ? EMPTY : this.firebaseActivitiesCountService.getActivitiesCount();
				}),
				this.takeUntil()
			)
			.subscribe((activitiesCount: Array<ActivitiesCount>) => {
				this.activitiesCount = activitiesCount;
				this.activitiesCountRepository.next(activitiesCount);
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
