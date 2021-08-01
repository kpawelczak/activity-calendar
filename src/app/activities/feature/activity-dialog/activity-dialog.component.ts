import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SelectedActivityService } from '../../store/selected-activity/selected-activity.service';
import { ActivityForm } from './activity-form';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivityDialogData } from './activity-dialog-data';
import { CalendarActivity } from '../../store/activities/calendar-activity';
import { UnitsRepository } from '../../../activities-config/store/units/units.repository';
import { ActivityDimensioned } from '../../store/activities/activity-dimensioned';

@Component({
	selector: 'ac-activity-dialog',
	templateUrl: 'activity-dialog.component.html',
	host: {
		'[class.ac-activity-dialog]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDialogComponent extends ActivityForm implements OnInit {

	loading: boolean = false;

	units: Array<string>;

	constructor(private readonly selectedDayActivityService: SelectedActivityService,
				private readonly unitsRepository: UnitsRepository,
				private readonly matDialog: MatDialog,
				@Inject(MAT_DIALOG_DATA) private readonly selectedDayDialogData: ActivityDialogData,
				private readonly changeDetectorRef: ChangeDetectorRef,
				formBuilder: FormBuilder) {
		super(formBuilder, selectedDayDialogData.selectedActivity);
	}

	ngOnInit() {
		this.unitsRepository
			.onValues()
			.pipe(this.takeUntil())
			.subscribe((units: Array<string>) => {
				this.units = units;
				if (this.selectedDayDialogData.selectedActivity) {
					this.fillForm(this.selectedDayDialogData.selectedActivity);
				}
				this.changeDetectorRef.detectChanges();
			});
	}

	getFormTypeText(): string {
		return this.selectedDayDialogData.selectedActivity ? 'Edit' : 'Add';
	}

	manageActivity(): void {
		if (this.form.valid) {
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

	private addActivity(): void {
		const calendarActivity = new CalendarActivity(
			this.selectedDayDialogData.selectedDay.getTime(),
			this.form.controls['name'].value,
			[new ActivityDimensioned('', '')]
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
			this.form.controls['name'].value,
			this.form.controls['amount'].value,
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

}
