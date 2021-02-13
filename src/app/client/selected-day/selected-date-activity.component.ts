import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Reactive } from '../../common/reactive';
import { SelectedDateActivityService } from './selected-date-activity.service';
import { CalendarFirebaseService } from '../../firebase/activities/calendar-firebase.service';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';

@Component({
	selector: 'ac-selected-day-activity',
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

			<button *ngIf="activitySelected"
					(click)="clearSelection()">
				Cancel
			</button>

			<button mat-raised-button color="primary"
					(click)="addActivity()">
				{{getButtonText()}}
			</button>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDateActivityComponent extends Reactive implements OnInit {

	@Input()
	selectedDay: Date;

	form: FormGroup;

	activitySelected: boolean = false;

	constructor(private readonly formBuilder: FormBuilder,
				private readonly selectedActivityService: SelectedDateActivityService,
				private readonly calendarFirebaseService: CalendarFirebaseService) {
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

			switch (true) {
				case this.activitySelected: {
					this.calendarFirebaseService.updateActivity(this.selectedDay, this.form.value);
					break;
				}

				default: {
					this.calendarFirebaseService.addActivity(this.selectedDay, this.form.value);
				}
			}

		}
	}

	clearSelection(): void {
		this.selectedActivityService.next(null);
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
