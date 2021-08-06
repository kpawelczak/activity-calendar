import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Type } from '@angular/core';
import { AbstractFormArray } from '../../../../common/cdk/form-array.abstract';
import { ActivityDimensioned } from '../../../store/activities/activity-dimensioned';

interface ActivityFormAttributes {
	name: string;
	dimensionedActivities: Array<ActivityDimensioned>;
}

export abstract class ActivityForm<T extends ActivityFormAttributes> extends AbstractFormArray<ActivityDimensioned> {

	activityForm: FormGroup;

	protected constructor() {
		super();
	}

	getType(): Type<ActivityDimensioned> {
		return ActivityDimensioned;
	}

	initForm(activity: T): void {
		if (activity) {
			this.activityForm = new FormGroup({
				name: new FormControl(activity.name),
				entries: this.createFormArray(activity.dimensionedActivities)
			});
		} else {
			this.activityForm = new FormGroup({
				name: new FormControl(),
				entries: this.createFormArray([new ActivityDimensioned('', '')])
			});
		}
		this.activityForm.controls['name'].setValidators(Validators.required);
		this.activityForm.controls['entries'].setValidators(Validators.required);
	}

	getFormEntries(): FormArray {
		return this.activityForm?.get('entries') as FormArray;
	}

	addEntry(): void {
		this.addToFormArray(new ActivityDimensioned('', ''));
	}
}
