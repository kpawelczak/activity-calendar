import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { TemplateSetsService } from '../../store/sets/template-sets.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivityCalendarForm } from '../../../../common/utils/form/activity-calendar-form';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TemplateSetDialogData } from './template-set-dialog-data';

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
						   (click)="saveTemplate()">
					{{getButtonText()}}
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
export class TemplateSetDialogComponent extends ActivityCalendarForm implements OnInit {

	loading: boolean;

	constructor(private readonly templateSetsService: TemplateSetsService,
				private readonly matDialog: MatDialog,
				private readonly formBuilder: FormBuilder,
				@Inject(MAT_DIALOG_DATA) private readonly templateSetDialogData: TemplateSetDialogData,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
		this.form = this.formBuilder.group({
			name: ['', Validators.required]
		});
	}

	ngOnInit() {
		if (this.isEdit()) {
			this.form.controls['name'].setValue(this.templateSetDialogData.templateSetName);
		}
	}

	saveTemplate(): void {
		if (this.form.valid) {
			this.loading = true;
			const templateSetName = this.form.controls['name'].value;
			if (this.isEdit()) {
				this.editTemplateSet(templateSetName);
			} else {
				this.addTemplateSet(templateSetName);
			}
		}
	}

	closeDialog(): void {
		this.matDialog.closeAll();
	}

	getButtonText(): string {
		return this.isEdit() ? 'Edit' : 'Add';
	}

	private editTemplateSet(templateSetName: string): void {
		this.templateSetsService
			.editTemplateSetName(templateSetName, this.templateSetDialogData.templateSetName)
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

	private addTemplateSet(templateSetName: string): void {
		this.templateSetsService
			.addTemplateSetName(templateSetName)
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

	private isEdit(): boolean {
		return !!this.templateSetDialogData.templateSetName;
	}
}
