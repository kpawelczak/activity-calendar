import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ActivityConfigForm } from './activity-config-form';
import { ActivityConfig } from '../../store/activity-config';
import { DefinedActivityService } from '../../store/defined-activities/defined-activity.service';
import { ActivityEntry } from '../../store/activity-entry';
import { UnitsRepository } from '../../store/units/units.repository';

@Component({
	templateUrl: './activity-config-dialog.component.html',
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityConfigDialogComponent extends ActivityConfigForm implements OnInit {

	loading: boolean;

	units: Array<string>;

	constructor(private readonly matDialog: MatDialog,
				private readonly definedActivityService: DefinedActivityService,
				private readonly unitsRepository: UnitsRepository,
				private readonly changeDetectorRef: ChangeDetectorRef,
				@Inject(MAT_DIALOG_DATA) private readonly acConfig: ActivityConfig) {
		super(acConfig);
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

	saveForm(): void {
		if (this.activityConfigForm.valid) {
			this.loading = true;

			const entries = this.getFormEntries()?.value.map((activityEntry: ActivityEntry) => new ActivityEntry(activityEntry.entryUnit)),
				activityConfig = new ActivityConfig(this.activityConfigForm.controls['name'].value, entries, this.acConfig?.getUUID());

			if (this.isEdit()) {
				this.definedActivityService
					.editActivityConfig(activityConfig)
					.subscribe(() => {
						this.matDialog.closeAll();
					}, () => {
						this.loading = false;
						this.changeDetectorRef.detectChanges();
					});
			} else {
				this.definedActivityService
					.addActivityConfig(activityConfig)
					.subscribe(() => {
						this.matDialog.closeAll();
					}, () => {
						this.loading = false;
						this.changeDetectorRef.detectChanges();
					});
			}
		}
	}

	closeDialog(): void {
		this.matDialog.closeAll();
	}

	getButtonText(): string {
		return this.isEdit() ? 'Edit' : 'Add';
	}

	isEdit(): boolean {
		return !!this.acConfig;
	}
}
