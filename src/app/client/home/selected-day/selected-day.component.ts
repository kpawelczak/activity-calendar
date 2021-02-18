import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../../../common/reactive';
import { FabricDateUtilService } from '../../../common/date-util/fabric-date-util.service';
import { CalendarActivity } from '../../../firebase/activities/month-activities/calendar-activity';
import { FirestoreMonthActivitiesRepository } from '../../../firebase/activities/month-activities/firestore-month-activities.repository';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SelectedDayActivitiesRepository } from './selected-day-activities.repository';

@Component({
	selector: 'ac-selected-day',
	template: `
		<h2 class="selected-activity-day">{{selectedDay | date:'EEEE, MMMM d, y'}}</h2>

		<mat-tab-group mat-stretch-tabs dynamicHeight>

			<mat-tab *ngIf="activities?.length > 0"
					 [label]="getActivitiesLabel()">

				<ac-selected-date-activities [selectedDay]="selectedDay"
											 [activities]="activities"
											 [isSelectedDayToday]="isSelectedDayToday"></ac-selected-date-activities>

			</mat-tab>

			<mat-tab *ngIf="isSelectedDayToday()"
					 label="Template">

				<ac-selected-day-template></ac-selected-day-template>

			</mat-tab>

		</mat-tab-group>

		<ac-selected-activity-form *ngIf="isSelectedDayToday()"
								   [selectedDay]="selectedDay">
		</ac-selected-activity-form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayComponent extends Reactive implements OnInit {

	selectedDay: Date;

	activities: Array<CalendarActivity>;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly selectedDateActivitiesService: SelectedDayActivitiesRepository,
				private readonly monthActivitiesRepository: FirestoreMonthActivitiesRepository,
				private readonly dateUtilService: FabricDateUtilService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.monthActivitiesRepository
			.onMonthActivities()
			.pipe(
				switchMap((monthActivities: Array<CalendarActivity>) => {
					this.selectedDateActivitiesService.setMonthActivities(monthActivities);
					return this.selectedDayService.observeSelectedDate();
				}),
				distinctUntilChanged(),
				this.takeUntil()
			)
			.subscribe((selectedDate: Date) => {
				this.selectedDay = selectedDate;
				this.selectedDateActivitiesService.selectDayActivities(this.selectedDay);
				this.changeDetectorRef.detectChanges();
			});

		this.selectedDateActivitiesService
			.onActivities()
			.pipe(this.takeUntil())
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});
	}

	isSelectedDayToday(): boolean {
		return this.selectedDay ? this.dateUtilService.areDatesSame(this.selectedDay, new Date()) : false;
	}

	getActivitiesLabel(): string {
		return this.isSelectedDayToday() ? 'Activities' : 'Past activities';
	}
}
