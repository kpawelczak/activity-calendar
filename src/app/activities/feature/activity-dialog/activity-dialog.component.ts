import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SelectedActivityService } from '../../store/selected-activity/selected-activity.service';
import { ActivityForm } from '../../../common/utils/form/activity-form';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivityDialogData } from './activity-dialog-data';
import { CalendarActivity } from '../../store/activities/calendar-activity';

@Component({
	selector: 'ac-activity-dialog',
	template: `
		<h2 class="selected-activity-form-title">{{getFormTypeText()}} activity</h2>

		<form [formGroup]="form">

			<mat-form-field class="example-form-field">

				<mat-label>Activity</mat-label>
				<input matInput type="text" formControlName="name">

				<button *ngIf="hasValue('name')"
						type="button"
						(click)="clearFormItem('name')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<mat-form-field class="example-form-field">

				<mat-label>Amount</mat-label>

				<input matInput type="text" formControlName="amount">

				<button *ngIf="hasValue('amount')"
						type="button"
						(click)="clearFormItem('amount')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<div class="ac-selected-activity-form-buttons">
				<button mat-button
						[type]="'button'"
						(click)="closeDialog()">
					Cancel
				</button>

				<ac-button [loading]="loading"
						   [type]="'submit'"
						   (click)="manageActivity()">
					{{getFormTypeText()}}
				</ac-button>
			</div>

		</form>
	`,
	host: {
		'[class.ac-activity-dialog]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDialogComponent extends ActivityForm implements OnInit {

	loading: boolean = false;

	constructor(private readonly selectedDayActivityService: SelectedActivityService,
				private readonly matDialog: MatDialog,
				@Inject(MAT_DIALOG_DATA) private readonly selectedDayDialogData: ActivityDialogData,
				formBuilder: FormBuilder) {
		super(formBuilder);
	}

	ngOnInit() {
		if (this.selectedDayDialogData.selectedActivity) {
			this.fillForm(this.selectedDayDialogData.selectedActivity);
		}
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
			this.form.controls['amount'].value
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
			this.selectedDayDialogData.selectedActivity.getActivityUUID()
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
