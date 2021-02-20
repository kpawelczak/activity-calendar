import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectedActivityRepository } from '../activity/selected-activity.repository';
import { CalendarActivity } from '../../../../firebase/activities/month-activities/calendar-activity';
import { Reactive } from '../../../../common/reactive';
import { SelectedDayActivitiesRepository } from './selected-day-activities.repository';
import { SelectedActivityService } from '../activity/selected-activity.service';
import { FabricDateUtilService } from '../../../../common/date-util/fabric-date-util.service';

@Component({
	selector: 'ac-selected-date-activities',
	template: `
		<div class="ac-selected-date-activity header">

			<span>#</span>

			<span>Name</span>

			<span>Reps</span>

		</div>

		<div *ngFor="let activity of activities; let i = index"
			 [class.selected-activity]="isActivitySelected(activity)"
			 (click)="selectActivity(activity)"
			 class="ac-selected-date-activity">

			<span>{{i + 1}}</span>

			<span>{{activity.name}}</span>

			<span>{{activity.reps}}</span>

			<mat-icon *ngIf="isSelectedDayToday()"
					  (click)="deleteActivity(activity)">
				delete
			</mat-icon>

		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayActivitiesComponent extends Reactive implements OnInit {

	@Input()
	selectedDay: Date;

	@Input()
	activities: Array<CalendarActivity>;

	@Input()
	isSelectedDayToday: () => boolean;

	selectedActivity: CalendarActivity;

	constructor(private readonly selectedActivityRepository: SelectedActivityRepository,
				private readonly selectedActivityService: SelectedActivityService,
				private readonly selectedActivitiesService: SelectedDayActivitiesRepository,
				private readonly dateUtilService: FabricDateUtilService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
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
		event.preventDefault();
		event.stopPropagation();
		this.selectedActivityService.deleteActivity(this.selectedDay, activity).finally();
	}

	isActivitySelected(activity: CalendarActivity): boolean {
		return this.selectedActivity?.getActivityUUID() === activity.getActivityUUID();
	}
}
