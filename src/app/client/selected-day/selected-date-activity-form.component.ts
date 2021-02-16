import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reactive } from '../../common/reactive';
import { SelectedDateActivityService } from './selected-date-activity.service';
import { FirestoreSelectedDayActivitiesService } from '../../firebase/activities/selected-day-activities/firestore-selected-day-activities.service';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';

@Component({
	selector: 'ac-selected-activity-form',
	template: `
		<form [formGroup]="form">

			<mat-form-field class="example-form-field">

				<mat-label>Activity</mat-label>
				<input matInput type="text" formControlName="name">

				<button *ngIf="hasValue('name')"
						(click)="clearFormItem('name')"
						mat-button matSuffix mat-icon-button aria-label="Clear">
					<mat-icon>close</mat-icon>
				</button>

			</mat-form-field>

			<mat-form-field class="example-form-field">

				<mat-label>Reps</mat-label>

				<input matInput type="number" formControlName="reps">

				<button *ngIf="hasValue('reps')"
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
				{{getButtonText()}}
			</ac-button>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDateActivityFormComponent extends Reactive implements OnInit {

	@Input()
	selectedDay: Date;

	form: FormGroup;

	selectedActivity: CalendarActivity;

	loading: boolean = false;

	constructor(private readonly formBuilder: FormBuilder,
				private readonly selectedActivityService: SelectedDateActivityService,
				private readonly calendarFirebaseService: FirestoreSelectedDayActivitiesService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			reps: ['', Validators.required]
		});
	}

	ngOnInit() {
		this.selectedActivityService
			.onActivity()
			.pipe(this.takeUntil())
			.subscribe((activity: CalendarActivity) => {
				this.selectedActivity = activity;
				this.fillForm(activity);
			});
	}

	getButtonText(): string {
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
		this.selectedActivityService.selectActivity(null);
		this.form.reset();
	}

	clearFormItem(formControlValue: string): void {
		this.form.controls[formControlValue].reset();
	}

	hasValue(formControlName: string): boolean {
		return !!this.form.controls[formControlName].value;
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

	private fillForm(activity: CalendarActivity): void {
		if (activity) {
			this.form.controls['name'].setValue(activity.name);
			this.form.controls['reps'].setValue(activity.reps);
		}
	}
}
