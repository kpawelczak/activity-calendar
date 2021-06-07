import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../../common/cdk/reactive';
import { CalendarActivity } from '../../common/models/calendar-activity';
import { ActivitiesRepository } from '../../activities/store/activities/activities.repository';
import { ActiveMonth } from '../../calendar/common/models/activity-calendar-year-month';
import { switchMap } from 'rxjs/operators';
import { ActivitiesCount } from '../../common/models/activities-count';
import { EMPTY } from 'rxjs';
import { ActivitiesCountRepository } from '../../activities/store/count/activities-count.repository';
import { FirebaseActivitiesCountService } from '../../activities/infrastructure/firebase-activities-count.service';
import { ActiveDateService } from '../../calendar/active-date.service';

@Component({
	selector: 'ac-home',
	template: `
		<ac-calendar [monthActivities]="monthActivities"
					 [activitiesCount]="activitiesCount"
					 (onMonthChange)="loadActivities($event)"></ac-calendar>

		<ng-container *ngIf="selectedDay">
			<ac-selected-day [selectedDay]="selectedDay"></ac-selected-day>
		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientHomeComponent extends Reactive implements OnInit {

	monthActivities: Array<CalendarActivity>;

	activitiesCount: Array<ActivitiesCount>;

	selectedDay: Date;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly activitiesCountRepository: ActivitiesCountRepository,
				private readonly firebaseActivitiesCountService: FirebaseActivitiesCountService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.selectedDayService
			.observeSelectedDate()
			.pipe(this.takeUntil())
			.subscribe((selectedDay: Date) => {
				this.selectedDay = selectedDay;
				this.changeDetectorRef.detectChanges();
			});

		this.activitiesRepository
			.onValues()
			.pipe(this.takeUntil())
			.subscribe((calendarActivities: Array<CalendarActivity>) => {
				this.monthActivities = [...calendarActivities];
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

	loadActivities(activeMonth: ActiveMonth): void {
		this.activitiesRepository.loadActivities(activeMonth.year, activeMonth.month);
	}

}
