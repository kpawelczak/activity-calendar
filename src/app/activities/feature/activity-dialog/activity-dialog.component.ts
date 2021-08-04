import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectedActivityService } from '../../store/selected-activity/selected-activity.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivityDialogData } from './activity-dialog-data';
import { CalendarActivity } from '../../store/activities/calendar-activity';
import { UnitsRepository } from '../../../activities-config/store/units/units.repository';
import { Reactive } from '../../../common/cdk/reactive';
import { ActivityFormEntry } from './activity-form-entry';

@Component({
	selector: 'ac-activity-dialog',
	templateUrl: 'activity-dialog.component.html',
	host: {
		'[class.ac-activity-dialog]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDialogComponent extends Reactive implements OnInit {

	loading: boolean = false;

	units: Array<string>;

	activeTabIndex: number = 0;

	customActivityValues: ActivityFormEntry;

	definedActivityValues: ActivityFormEntry;

	constructor(private readonly selectedDayActivityService: SelectedActivityService,
				private readonly unitsRepository: UnitsRepository,
				private readonly matDialog: MatDialog,
				private readonly changeDetectorRef: ChangeDetectorRef,
				@Inject(MAT_DIALOG_DATA) private readonly selectedDayDialogData: ActivityDialogData) {
		super();
	}

	ngOnInit() {
		this.unitsRepository
			.onValues()
			.pipe(this.takeUntil())
			.subscribe((units: Array<string>) => {
				this.units = units;
				this.changeDetectorRef.detectChanges();
			});
	}

	getFormTypeText(): string {
		return this.selectedDayDialogData.selectedActivity ? 'Edit' : 'Add';
	}

	getCalendarActivity(): CalendarActivity {
		return this.selectedDayDialogData?.selectedActivity;
	}

	manageActivity(): void {
		if (this.getCurrentActivity()) {
			this.loading = true;

			switch (true) {

				case !!this.selectedDayDialogData.selectedActivity: {
					this.updateActivity();
					break;
				}

				default: {
					this.addActivity();
				}
			}
		}
	}

	closeDialog(): void {
		this.matDialog.closeAll();
	}

	setActivity(activityValues: ActivityFormEntry): void {
		this.activeTabIndex === 0
			? this.customActivityValues = activityValues
			: this.definedActivityValues = activityValues;
	}

	setActiveTab(tabIndex: number): void {
		this.activeTabIndex = tabIndex;
	}

	isDefinedActivityHidden(): boolean {
		return !this.selectedDayDialogData.selectedActivity;
	}

	private addActivity(): void {
		const calendarActivity = new CalendarActivity(
			this.selectedDayDialogData.selectedDay.getTime(),
			this.getCurrentActivity().name,
			this.getCurrentActivity().entries
		);

		this.selectedDayActivityService
			.addActivity(
				this.selectedDayDialogData.selectedDay,
				calendarActivity
			)
			.finally(() => {
				this.onResponse();
			});
	}

	private updateActivity(): void {
		const calendarActivity = new CalendarActivity(
			this.selectedDayDialogData.selectedActivity.day,
			this.getCurrentActivity().name,
			this.getCurrentActivity().entries,
			{
				activityUUID: this.selectedDayDialogData.selectedActivity.getActivityUUID()
			}
		);

		if (this.selectedDayDialogData.selectedActivity.getAssignedTemplateUUID()) {
			calendarActivity.setTemplateUUID(this.selectedDayDialogData.selectedActivity.getAssignedTemplateUUID());
		}

		this.selectedDayActivityService
			.updateActivity(this.selectedDayDialogData.selectedDay, calendarActivity)
			.finally(() => {
				this.onResponse();
			});
	}

	private onResponse(): void {
		this.loading = false;
		this.matDialog.closeAll();
	}

	private getCurrentActivity(): ActivityFormEntry {
		return this.activeTabIndex === 0 ? this.customActivityValues : this.definedActivityValues;
	}
}
