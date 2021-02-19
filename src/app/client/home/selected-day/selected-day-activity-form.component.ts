import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CalendarActivity } from '../../../firebase/activities/month-activities/calendar-activity';
import { SelectedActivityService } from './selected-activity.service';
import { SelectedActivityRepository } from './selected-activity.repository';
import { ActivityForm } from '../../../common/form/activity-form';

@Component({
	selector: 'ac-selected-activity-form',
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

				<mat-label>Reps</mat-label>

				<input matInput type="text" formControlName="reps">

				<button *ngIf="hasValue('reps')"
						type="button"
						(click)="clearFormItem('reps')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<ac-button *ngIf="selectedActivity"
					   (click)="clearSelection()">
				Cancel
			</ac-button>

			<ac-button [loading]="loading"
					   [type]="'submit'"
					   (click)="manageActivity()">
				{{getFormTypeText()}}
			</ac-button>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayActivityFormComponent extends ActivityForm implements OnInit {

	@Input()
	selectedDay: Date;

	selectedActivity: CalendarActivity;

	loading: boolean = false;

	constructor(private readonly selectedActivityRepository: SelectedActivityRepository,
				private readonly selectedActivityService: SelectedActivityService,
				private readonly changeDetectorRef: ChangeDetectorRef,
				formBuilder: FormBuilder) {
		super(formBuilder);
	}

	ngOnInit() {
		this.selectedActivityRepository
			.onActivity()
			.pipe(this.takeUntil())
			.subscribe((activity: CalendarActivity) => {
				this.selectedActivity = activity;
				this.fillForm(activity);
			});
	}

	getFormTypeText(): string {
		return this.selectedActivity ? 'Edit' : 'Add';
	}

	manageActivity(): void {
		if (this.form.valid) {
			this.loading = true;

			switch (true) {

				case !!this.selectedActivity: {
					this.updateActivity();
					break;
				}

				default: {
					this.addActivity();
				}
			}
		}
	}

	clearSelection(): void {
		this.selectedActivityRepository.selectActivity(null);
		this.form.reset();
	}

	private addActivity(): void {
		this.selectedActivityService
			.addActivity(this.selectedDay, this.form.value)
			.finally(() => {
				this.loading = false;
				this.form.reset();
				this.changeDetectorRef.detectChanges();
			});
	}

	private updateActivity(): void {
		const calendarActivity = new CalendarActivity(
			this.selectedActivity.day,
			this.selectedActivity.UUID,
			this.form.controls['name'].value,
			this.form.controls['reps'].value
		);

		this.selectedActivityService
			.updateActivity(this.selectedDay, calendarActivity)
			.finally(() => {
				this.loading = false;
				this.changeDetectorRef.detectChanges();
			});
	}

}
