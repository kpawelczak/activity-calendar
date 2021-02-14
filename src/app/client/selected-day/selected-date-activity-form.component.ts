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

			<ac-button *ngIf="activitySelected"
					   (click)="clearSelection()">
				Cancel
			</ac-button>

			<ac-button [loading]="loading"
					   [type]="'submit'"
					   (click)="addActivity()">
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

	activitySelected: boolean = false;

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
				this.activitySelected = !!activity;
				this.fillForm(activity);
			});
	}

	getButtonText(): string {
		return this.activitySelected ? 'Edit' : 'Add';
	}

	addActivity(): void {
		if (this.form.valid) {
			this.loading = true;

			switch (true) {
				case this.activitySelected: {
					this.calendarFirebaseService
						.updateActivity(this.selectedDay, this.form.value)
						.finally(() => {
							this.loading = false;
							this.changeDetectorRef.detectChanges();
						});
					break;
				}

				default: {
					this.calendarFirebaseService
						.addActivity(this.selectedDay, this.form.value)
						.finally(() => {
							this.loading = false;
							this.changeDetectorRef.detectChanges();
						});
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

	private fillForm(activity: CalendarActivity): void {
		if (activity) {
			this.form.controls['name'].setValue(activity.name);
			this.form.controls['reps'].setValue(activity.reps);
		}
	}
}
