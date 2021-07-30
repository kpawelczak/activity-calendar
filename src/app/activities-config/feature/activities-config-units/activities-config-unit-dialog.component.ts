import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UnitsService } from '../../store/units/units.service';
import { Reactive } from '../../../common/cdk/reactive';

@Component({
	template: `
		<h2 class="selected-activity-form-title">New unit</h2>

		<form [formGroup]="form">

			<mat-form-field>

				<mat-label>Unit name</mat-label>

				<input matInput type="text" formControlName="unit">

			</mat-form-field>

			<div class="ac-selected-activity-form-buttons">
				<button mat-button
						[type]="'button'"
						(click)="closeDialog()">
					Cancel
				</button>

				<ac-button [loading]="loading"
						   [type]="'submit'"
						   (click)="addUnit()">
					Add Unit
				</ac-button>
			</div>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesConfigUnitDialogComponent extends Reactive {

	loading: boolean;

	form: FormGroup;

	constructor(private readonly matDialog: MatDialog,
				private readonly formBuilder: FormBuilder,
				private readonly unitsService: UnitsService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
		this.form = this.formBuilder.group({
			'unit': ['', Validators.required]
		});
	}

	closeDialog(): void {
		this.matDialog.closeAll();
	}

	addUnit(): void {
		if (this.form.valid) {
			this.loading = true;
			this.changeDetectorRef.detectChanges();
			const unit = this.form.controls['unit'].value;

			this.unitsService
				.addUnit(unit)
				.pipe(this.takeUntil())
				.subscribe(() => {
					this.matDialog.closeAll();
				}, () => {
					this.loading = false;
					this.changeDetectorRef.detectChanges();
				});
		}
	}
}
