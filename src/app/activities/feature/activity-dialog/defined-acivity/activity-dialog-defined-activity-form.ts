import { AbstractFormArray } from '../../../../common/cdk/form-array.abstract';
import { ActivityEntry } from '../../../../activities-config/store/activity-entry';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Type } from '@angular/core';
import { ActivityConfig } from '../../../../activities-config/store/activity-config';
import { ActivityDimensioned } from '../../../store/activities/activity-dimensioned';

export abstract class ActivityDialogDefinedActivityForm extends AbstractFormArray<ActivityDimensioned> {

	activityForm: FormGroup;

	getType(): Type<ActivityDimensioned> {
		return ActivityDimensioned;
	}

	initForm(activityConfig: ActivityConfig): void {
		this.clearFormArray();

		if (activityConfig) {
			this.activityForm = new FormGroup({
				name: new FormControl(activityConfig.name),
				entries: this.createFormArray(this.createActivityDimensionedArray(activityConfig.entries))
			});
		}
	}

	getFormEntries(): FormArray {
		return this.activityForm?.get('entries') as FormArray;
	}

	getUnitValue(i: number): string {
		return this.getFormEntries().controls[i].value.unit;
	}

	private createActivityDimensionedArray(units: Array<ActivityEntry>): Array<ActivityDimensioned> {
		return units.map((activityEntry: ActivityEntry) => new ActivityDimensioned('', activityEntry.entryUnit));
	}
}
