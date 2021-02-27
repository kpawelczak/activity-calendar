import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectedActivityRepository } from '../activity/selected-activity.repository';
import { Reactive } from '../../../../common/reactive';
import { SelectedDayActivitiesRepository } from './selected-day-activities.repository';
import { SelectedDayActivityService } from '../activity/selected-day-activity.service';
import { FabricDateUtilService } from '../../../../common/date-util/fabric-date-util.service';
import { MatDialog } from '@angular/material/dialog';
import { SelectedDayActivityDialogComponent } from '../activity/selected-day-activity-dialog.component';
import { CalendarActivity } from '../../../../common/models/calendar-activity';

@Component({
	selector: 'ac-selected-date-activities',
	template: `
		<div class="ac-selected-date-activity header">

			<span>#</span>

			<span>Name</span>

			<span>Amount</span>

		</div>

		<div *ngFor="let activity of activities; let i = index"
			 [class.activity-disabled]="!isSelectedDayToday()"
			 (click)="selectActivity(activity)"
			 class="ac-selected-date-activity">

			<span>{{i + 1}}</span>

			<span>{{activity.name}}</span>

			<span>{{activity.amount}}</span>

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

	constructor(private readonly selectedActivityRepository: SelectedActivityRepository,
				private readonly selectedActivityService: SelectedDayActivityService,
				private readonly selectedActivitiesService: SelectedDayActivitiesRepository,
				private readonly matDialog: MatDialog,
				private readonly dateUtilService: FabricDateUtilService) {
		super();
	}

	ngOnInit() {
		this.selectedActivityRepository
			.onActivity()
			.pipe(this.takeUntil())
			.subscribe((selectedActivity: CalendarActivity) => {
				this.matDialog.open(SelectedDayActivityDialogComponent, {
					panelClass: 'activity-calendar-dialog',
					data: {
						selectedDay: this.selectedDay,
						selectedActivity
					}
				});
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
}
