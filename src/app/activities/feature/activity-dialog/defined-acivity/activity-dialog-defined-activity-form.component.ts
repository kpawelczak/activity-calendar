import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ActivityDialogDefinedActivityForm } from './activity-dialog-defined-activity-form';
import { ActivityConfig } from '../../../../activities-config/store/activity-config';

@Component({
	selector: 'ac-dialog-defined-activity-form',
	template: `
		<form [formGroup]="activityForm">

			<div *ngIf="getFormEntries()"
				 [formArrayName]="'entries'">

				<div *ngFor="let item of getFormEntries().controls; let i = index"
					 [formGroupName]="i">

					<mat-form-field>

						<mat-label>{{getUnitValue(i)}}</mat-label>
						<input matInput type="text" [formControlName]="'value'">

					</mat-form-field>

				</div>

			</div>

		</form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDialogDefinedActivityFormComponent extends ActivityDialogDefinedActivityForm implements OnChanges {

	@Input()
	activityConfig: ActivityConfig;

	constructor() {
		super();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.activityConfig) {
			this.initForm(this.activityConfig);
		}
	}
}
