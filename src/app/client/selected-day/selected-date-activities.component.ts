import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectedActivityRepository } from './selected-activity.repository';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';
import { Reactive } from '../../common/reactive';
import { SelectedDateActivitiesRepository } from './selected-date-activities.repository';
import { SelectedActivityService } from './selected-activity.service';
import { FabricDateUtilService } from '../../common/date-util/fabric-date-util.service';

@Component({
	selector: 'ac-selected-date-activities',
	template: `
		<div *ngFor="let activity of activities; let i = index"
			 [class.selected-activity]="isActivitySelected(activity)">

			<span (click)="selectActivity(activity)">{{activity.name}} - {{activity.reps}}</span>

			<mat-icon *ngIf="isSelectedDayToday()"
					  (click)="deleteActivity(activity)">delete
			</mat-icon>

		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDateActivitiesComponent extends Reactive implements OnInit {

	@Input()
	selectedDay: Date;

	@Input()
	activities: Array<CalendarActivity>;

	@Input()
	isSelectedDayToday: () => boolean;

	selectedActivity: CalendarActivity;

	constructor(private readonly selectedActivityRepository: SelectedActivityRepository,
				private readonly selectedActivityService: SelectedActivityService,
				private readonly selectedActivitiesService: SelectedDateActivitiesRepository,
				private readonly dateUtilService: FabricDateUtilService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.selectedActivitiesService
			.onActivities()
			.pipe(this.takeUntil())
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});

		this.selectedActivityRepository
			.onActivity()
			.pipe(this.takeUntil())
			.subscribe((selectedActivity: CalendarActivity) => {
				this.selectedActivity = selectedActivity;
				this.changeDetectorRef.detectChanges();
			});
	}

	selectActivity(activity: CalendarActivity): void {
		this.selectedActivityRepository.selectActivity(activity);
	}

	deleteActivity(activity: CalendarActivity): void {
		this.selectedActivityService.deleteActivity(this.selectedDay, activity).finally();
	}

	isActivitySelected(activity: CalendarActivity): boolean {
		return this.selectedActivity?.UUID === activity.UUID;
	}
}
