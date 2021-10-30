import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UnitsRepository } from '../../../../activities-config/store/units/units.repository';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TemplateActivityDialogData } from './template-activity-dialog-data';
import { TemplateService } from '../../../store/template/template.service';
import { ActivityFormEntry } from '../../../../activities/feature/activity-dialog/activity-form-entry';
import { TemplateActivity } from '../../../template-activity';
import { Reactive } from '../../../../../common/cdk/reactive';

@Component({
	template: `
		<mat-tab-group mat-stretch-tabs dynamicHeight
					   (selectedIndexChange)="setActiveTab($event)">

			<mat-tab [label]="getFormTypeText() + ' activity'">

				<ac-dialog-custom-activity [templateActivity]="getTemplateActivity()"
										   [units]="units"
										   (onCalendarActivity)="setActivity($event)">
				</ac-dialog-custom-activity>

			</mat-tab>

			<mat-tab *ngIf="isDefinedActivityHidden()"
					 [label]="'Defined activity'">

				<ac-template-defined-activity (onCalendarActivity)="setActivity($event)"></ac-template-defined-activity>

			</mat-tab>

		</mat-tab-group>

		<div class="ac-form-buttons">
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
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateActivityDialogComponent extends Reactive implements OnInit {

	loading: boolean = false;

	units: Array<string>;

	activeTabIndex: number = 0;

	customActivityValues: ActivityFormEntry;

	definedActivityValues: ActivityFormEntry;

	constructor(private readonly templateService: TemplateService,
				private readonly unitsRepository: UnitsRepository,
				private readonly matDialog: MatDialog,
				@Inject(MAT_DIALOG_DATA) private readonly selectedTemplateDialogData: TemplateActivityDialogData,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
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
		if (this.getCurrentActivity()) {
			this.loading = true;
			const name = this.getCurrentActivity().name,
				dimensionedActivities = this.getCurrentActivity().entries;

			this.templateService
				.saveActivityToTemplate(this.selectedTemplateDialogData.weekdayTemplate,
					name,
					dimensionedActivities,
					this.selectedTemplateDialogData.templateActivity
				)
				.pipe(this.takeUntil())
				.subscribe(() => {
					this.loading = false;
					this.matDialog.closeAll();
				});
		}
	}

	setActivity(activityValues: ActivityFormEntry): void {
		this.activeTabIndex === 0
			? this.customActivityValues = activityValues
			: this.definedActivityValues = activityValues;
	}

	setActiveTab(tabIndex: number): void {
		this.activeTabIndex = tabIndex;
	}

	isDefinedActivityHidden(): boolean {
		return !this.selectedTemplateDialogData.templateActivity;
	}

	getTemplateActivity(): TemplateActivity {
		return this.selectedTemplateDialogData?.templateActivity;
	}

	private getCurrentActivity(): ActivityFormEntry {
		return this.activeTabIndex === 0 ? this.customActivityValues : this.definedActivityValues;
	}
}
