import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { TemplateSetsService } from '../../store/sets/template-sets.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivityCalendarForm } from '../../../common/utils/form/activity-calendar-form';
import { MatDialog } from '@angular/material/dialog';

@Component({
	template: `
		<h2 class="selected-activity-form-title">New template set</h2>

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

			<div class="ac-selected-activity-form-buttons">
				<button mat-button
						[type]="'button'"
						(click)="closeDialog()">
					Cancel
				</button>

				<ac-button [loading]="loading"
						   [type]="'submit'"
						   (click)="addTemplate()">
					Add
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
export class TemplateSetDialogComponent extends ActivityCalendarForm {

	loading: boolean;

	constructor(private readonly templateSetsService: TemplateSetsService,
				private readonly matDialog: MatDialog,
				private readonly formBuilder: FormBuilder,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
		this.form = this.formBuilder.group({
			name: ['', Validators.required]
		});
	}

	addTemplate(): void {
		if (this.form.valid) {
			this.loading = true;
			const templateName = this.form.controls['name'].value;
			this.templateSetsService
				.addTemplateSetName(templateName)
				.pipe(
					this.takeUntil()
				)
				.subscribe(() => {
					this.loading = false;
					this.closeDialog();
				}, () => {
					this.loading = false;
					this.changeDetectorRef.detectChanges();
				});
		}
	}

	closeDialog(): void {
		this.matDialog.closeAll();
	}
}
