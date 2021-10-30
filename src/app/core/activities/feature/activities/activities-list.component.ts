import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectedActivityRepository } from '../../store/selected-activity/selected-activity.repository';
import { Reactive } from '../../../../common/cdk/reactive';
import { SelectedActivityService } from '../../store/selected-activity/selected-activity.service';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDialogComponent } from '../activity-dialog/activity-dialog.component';
import { CalendarActivity } from '../../store/activities/calendar-activity';

@Component({
	selector: 'ac-activities-list',
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

			<span>{{activity.quantifiedActivity | quantifiedActivity}}</span>

			<mat-icon *ngIf="isSelectedDayToday()"
					  (click)="deleteActivity(activity)">
				delete
			</mat-icon>

		</div>
	`,
	host: {
		'[class.ac-activities-list]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesListComponent extends Reactive implements OnInit {

	@Input()
	selectedDay: Date;

	@Input()
	activities: Array<CalendarActivity>;

	@Input()
	isSelectedDayToday: () => boolean;

	constructor(private readonly selectedActivityRepository: SelectedActivityRepository,
				private readonly selectedActivityService: SelectedActivityService,
				private readonly matDialog: MatDialog) {
		super();
	}

	ngOnInit() {
		this.selectedActivityRepository
			.onActivity()
			.pipe(this.takeUntil())
			.subscribe((selectedActivity: CalendarActivity) => {
				this.matDialog
					.open(ActivityDialogComponent, {
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
		this.selectedActivityService.deleteActivity(this.selectedDay, activity).then();
	}
}
