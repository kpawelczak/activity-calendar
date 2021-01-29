import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from './active-date.service';
import { ActivityCalendarWeeks } from './components/weeks/activity-calendar.weeks';
import { ActivityCalendarYears } from './components/years/activity-calendar.years';
import { ActivityCalendarViewService } from './activity-calendar-view.service';
import { ActivityCalendarService } from './activity-calendar.service';
import { ActivityCalendarYearsService } from './components/years/activity-calendar-years.service';
import { Reactive } from '../common/reactive';
import { ActivityCalendarView } from './common/models/activity-calendar-view';


@Component({
	selector: 'act-calendar',
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

	selectedMonth: number = new Date().getMonth() + 1;

	selectedYear: number;

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
		this.calendarService
			.observeDateMonth()
			.pipe(this.takeUntil())
			.subscribe((month: number) => {
				this.selectedMonth = month;
				this.calculateDatePickerData();
				this.changeDetectorRef.detectChanges();
			});

		this.calendarService
			.observeDateYear()
			.pipe(this.takeUntil())
			.subscribe((year: number) => {
				this.selectedYear = year;
				this.calculateDatePickerData();
				this.changeDetectorRef.detectChanges();
			});

		this.datePickerService
			.observeSelectedDate()
			.pipe(this.takeUntil())
			.subscribe((date: Date) => {
				this.selectedDate = date;
				this.selectedYear = date.getFullYear();
				this.selectedMonth = date.getMonth();
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

		this.calculateDatePickerData();
	}

	getCalendarView(): ActivityCalendarView {
		if (event) {
			event.stopPropagation();
		}

		return this.activityCalendarView;
	}

	private calculateDatePickerData(): void {
		this.weeks = this.datePickerWeeks.getDaysInMonths(this.selectedYear, this.selectedMonth);
		this.prevWeeks = this.datePickerWeeks.getDaysInMonths(this.selectedYear, this.selectedMonth - 1);
		this.nextWeeks = this.datePickerWeeks.getDaysInMonths(this.selectedYear, this.selectedMonth + 1);

		this.years = this.datePickerYears.getYears(this.selectedYear);
	}
}
