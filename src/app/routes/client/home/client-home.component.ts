import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../../../common/cdk/reactive';
import { CalendarActivity } from '../../../core/activities/store/activities/calendar-activity';
import { ActivitiesRepository } from '../../../core/activities/store/activities/activities.repository';
import { ActiveMonth } from '../../../core/calendar/active-month';
import { filter, switchMap } from 'rxjs/operators';
import { ActivitiesCount } from '../../../core/activities/store/count/activities-count';
import { combineLatest, EMPTY } from 'rxjs';
import { ActivitiesCountRepository } from '../../../core/activities/store/count/activities-count.repository';
import { FirebaseActivitiesCountService } from '../../../core/activities/infrastructure/firebase-activities-count.service';
import { ActiveDateService } from '../../../core/calendar/active-date.service';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { SelectedActivitiesRepository } from '../../../core/activities/store/selected-activities/selected-activities.repository';
import { SelectedActivitiesService } from '../../../core/activities/store/selected-activities/selected-activities.service';

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

	constructor(private readonly activeDateService: ActiveDateService,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly activitiesCountRepository: ActivitiesCountRepository,
				private readonly selectedActivitiesRepository: SelectedActivitiesRepository,
				private readonly selectedActivitiesService: SelectedActivitiesService,
				private readonly authenticationService: AuthenticationService,
				private readonly firebaseActivitiesCountService: FirebaseActivitiesCountService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		combineLatest([
			this.activitiesRepository.onValues(),
			this.activeDateService.observeSelectedDate()
		])
			.pipe(this.takeUntil())
			.subscribe(([calendarActivities, selectedDay]: [Array<CalendarActivity>, Date]) => {
				this.monthActivities = calendarActivities;
				this.selectedDay = selectedDay;
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

		this.authenticationService
			.onLoggedIn()
			.pipe(
				filter((loggedIn: boolean) => !loggedIn),
				this.takeUntil()
			)
			.subscribe(() => {
				this.activeDateService.reset();

				this.selectedActivitiesRepository.reset();
				this.selectedActivitiesService.resetSelectedDay();

				this.activitiesRepository.reset();
				this.activitiesCountRepository.reset();
			});
	}

	loadActivities(activeMonth: ActiveMonth): void {
		this.activitiesRepository.loadActivities(activeMonth.year, activeMonth.month);
	}

}
