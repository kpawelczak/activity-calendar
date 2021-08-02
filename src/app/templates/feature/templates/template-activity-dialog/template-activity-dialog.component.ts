import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UnitsRepository } from '../../../../activities-config/store/units/units.repository';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { TemplateActivityForm } from './template-activity-form';
import { TemplateActivityDialogData } from './template-activity-dialog-data';
import { TemplateService } from '../../../store/template/template.service';
import { TemplateActivity } from '../../../template-activity';
import { v4 as uuidv4 } from 'uuid';

@Component({
	template: `
		<h2 class="selected-activity-form-title">{{getFormTypeText()}} activity</h2>

		<form [formGroup]="activityForm">

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

			<div *ngIf="getFormEntries()"
				 [formArrayName]="'entries'">

				<div *ngFor="let item of getFormEntries().controls; let i = index"
					 [formGroupName]="i">

					<mat-form-field>

						<mat-label>Unit</mat-label>

						<mat-select [formControlName]="'unit'">
							<mat-option *ngFor="let unit of units"
										[value]="unit">
								{{unit}}
							</mat-option>
						</mat-select>

					</mat-form-field>

					<mat-form-field>

						<mat-label>Value</mat-label>
						<input matInput type="text" [formControlName]="'value'">

					</mat-form-field>

				</div>

			</div>

			<div class="ac-selected-activity-form-buttons">
				<button mat-button
						[type]="'button'"
						(click)="closeDialog()">
					Cancel
				</button>

				<ac-button [loading]="loading"
						   [type]="'submit'"
						   (click)="saveActivity()">
					{{getFormTypeText()}}
				</ac-button>
			</div>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateActivityDialogComponent extends TemplateActivityForm implements OnInit {

	loading: boolean = false;

	units: Array<string>;

	constructor(private readonly templateService: TemplateService,
				private readonly unitsRepository: UnitsRepository,
				private readonly matDialog: MatDialog,
				@Inject(MAT_DIALOG_DATA) private readonly selectedTemplateDialogData: TemplateActivityDialogData,
				private readonly changeDetectorRef: ChangeDetectorRef,
				formBuilder: FormBuilder) {
		super(formBuilder, selectedTemplateDialogData?.templateActivity);
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
		return this.selectedTemplateDialogData?.templateActivity ? 'Edit' : 'Add';
	}

	closeDialog(): void {
		this.matDialog.closeAll();
	}

	saveActivity(): void {
		if (this.activityForm.valid) {
			this.loading = true;
			const name = this.activityForm.controls['name'].value,
				dimensionedActivities = this.activityForm.controls['entries'].value,
				uuid = this.getTemplateUUID(),
				weekday = this.selectedTemplateDialogData.weekdayTemplate.getWeekday(),
				templateActivity = new TemplateActivity(weekday, name, dimensionedActivities, uuid);

			this.templateService
				.saveActivityToTemplate(this.selectedTemplateDialogData.weekdayTemplate, templateActivity)
				.pipe(this.takeUntil())
				.subscribe(() => {
					this.loading = false;
					this.matDialog.closeAll();
				});
		}
	}

	private getTemplateUUID(): string {
		return this.selectedTemplateDialogData.templateActivity?.templateUUID
			? this.selectedTemplateDialogData.templateActivity.templateUUID
			: uuidv4();
	}

}
