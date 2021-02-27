import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from './active-date.service';
import { ActivityCalendarWeeks } from './components/weeks/activity-calendar.weeks';
import { ActivityCalendarYears } from './components/years/activity-calendar.years';
import { ActivityCalendarViewService } from './activity-calendar-view.service';
import { ActivityCalendarService } from './activity-calendar.service';
import { ActivityCalendarYearsService } from './components/years/activity-calendar-years.service';
import { Reactive } from '../../../common/reactive';
import { ActivityCalendarView } from './common/models/activity-calendar-view';
import { FirestoreActivitiesService } from '../../../services/firebase/activities/activities/firestore-activities.service';
import { CalendarActivity } from '../../../common/models/calendar-activity';
import { switchMap } from 'rxjs/operators';
import { ActiveMonth } from './common/models/activity-calendar-year-month';


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

	constructor(private readonly datePickerService: ActiveDateService,
				private readonly datePickerWeeks: ActivityCalendarWeeks,
				private readonly datePickerYears: ActivityCalendarYears,
				private readonly datePickerYearsService: ActivityCalendarYearsService,
				private readonly calendarService: ActivityCalendarService,
				private readonly calendarViewService: ActivityCalendarViewService,
				private readonly firestoreActivitiesService: FirestoreActivitiesService,
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
				switchMap((activeMonth: ActiveMonth) => {
					this.activeYear = activeMonth.year;
					this.activeMonth = activeMonth.month;
					this.calculateDatePickerData();
					this.changeDetectorRef.detectChanges();

					return this.firestoreActivitiesService
							   .getMonthActivities(this.activeYear, this.activeMonth);
				}),
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
}
