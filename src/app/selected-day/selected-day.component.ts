import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../common/reactive';
import { CalendarFirebaseService } from '../firebase/calendar-firebase.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';

@Component({
	selector: 'act-selected-day',
	template: `
		<ng-container *ngIf="selectedDay">
			Selected Date: {{selectedDay | date:'EEEE, MMMM d, y, hh,mm,ss'}}

			<ac-selected-date-activities [activities]="activities"></ac-selected-date-activities>

			<form [formGroup]="form">

				<mat-form-field class="example-form-field">

					<mat-label>Activity</mat-label>
					<input matInput type="text" formControlName="activityName">

					<button *ngIf="hasValue('activityName')"
							mat-button matSuffix mat-icon-button aria-label="Clear">
						<mat-icon>close</mat-icon>
					</button>

				</mat-form-field>

				<mat-form-field class="example-form-field">

					<mat-label>Reps</mat-label>

					<input matInput type="number" formControlName="activityReps">

					<button *ngIf="hasValue('activityReps')"
							mat-button matSuffix mat-icon-button aria-label="Clear">
						<mat-icon>close</mat-icon>
					</button>

				</mat-form-field>

				<button mat-raised-button color="primary" (click)="addActivity()">add</button>

			</form>

		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayComponent extends Reactive implements OnInit {

	selectedDay: Date;

	form: FormGroup;

	activities: Array<any>;

	constructor(private readonly formBuilder: FormBuilder,
				private readonly selectedDayService: ActiveDateService,
				private readonly calendarFirebaseService: CalendarFirebaseService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
		this.form = this.formBuilder.group({
			activityName: ['', Validators.required],
			activityReps: ['', Validators.required]
		});
	}

	ngOnInit() {
		this.selectedDayService
			.observeSelectedDate()
			.pipe(
				switchMap((selectedDate: Date) => {
					this.selectedDay = selectedDate;
					return this.calendarFirebaseService
							   .getActivities(selectedDate);
				}),
				this.takeUntil())
			.subscribe((activities: any) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});
	}

	addActivity(): void {
		if (this.form.valid) {
			this.calendarFirebaseService.addActivity(this.selectedDay, this.form.value);
		}
	}

	hasValue(formControlName: string): boolean {
		return !!this.form.controls[formControlName].value;
	}

}
