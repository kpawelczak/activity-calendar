import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChanges,
	ViewEncapsulation
} from '@angular/core';
import { ActivityDialogDefinedActivityForm } from '../../../../../activities/feature/activity-dialog/defined-acivity/activity-dialog-defined-activity-form';
import { ActivityConfig } from '../../../../../activities-config/store/activity-config';

@Component({
	selector: 'ac-template-defined-activity-form',
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
export class TemplateDefinedActivityFormComponent extends ActivityDialogDefinedActivityForm implements OnChanges, OnInit {

	@Input()
	activityConfig: ActivityConfig;

	@Output()
	onCalendarActivity = new EventEmitter();

	constructor() {
		super();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.activityConfig) {
			this.initForm(this.activityConfig);
		}
	}

	ngOnInit() {
		this.activityForm
			.valueChanges
			.pipe(this.takeUntil())
			.subscribe((value: any) => {
				this.onCalendarActivity.emit(value);
			});
	}
}
