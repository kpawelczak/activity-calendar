import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../../../../../common/cdk/reactive';
import { DefinedActivitiesRepository } from '../../../../activities-config/store/defined-activities/defined-activities.repository';
import { ActivityConfig } from '../../../../activities-config/store/activity-config';
import { FormBuilder } from '@angular/forms';


@Component({
	selector: 'ac-dialog-defined-activity',
	template: `
		<mat-form-field>

			<mat-label>Activity</mat-label>
			<mat-select>
				<mat-option *ngFor="let definedActivity of definedActivities"
							[value]="definedActivity.name"
							(click)="select(definedActivity)">
					{{definedActivity.name}}
				</mat-option>
			</mat-select>

		</mat-form-field>

		<ac-dialog-defined-activity-form *ngIf="selectedActivityConfig"
										 [activityConfig]="selectedActivityConfig"
										 (onCalendarActivity)="onCalendarActivity.emit($event)">
		</ac-dialog-defined-activity-form>
	`,
	host: {
		'[class.ac-dialog-defined-activity]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityDialogDefinedActivityComponent extends Reactive implements OnInit {

	@Output()
	onCalendarActivity = new EventEmitter();

	definedActivities: Array<ActivityConfig>;

	selectedActivityConfig: ActivityConfig;

	constructor(private readonly definedActivitiesRepository: DefinedActivitiesRepository,
				private readonly formBuilder: FormBuilder,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.definedActivitiesRepository
			.onValues()
			.subscribe((definedActivities: Array<ActivityConfig>) => {
				this.definedActivities = definedActivities;
				this.changeDetectorRef.detectChanges();
			});
	}

	select(activityConfig: ActivityConfig): void {
		this.selectedActivityConfig = activityConfig;
		this.changeDetectorRef.detectChanges();
	}
}
