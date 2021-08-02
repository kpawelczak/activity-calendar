import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Type } from '@angular/core';
import { AbstractFormArray } from '../../../common/cdk/form-array.abstract';
import { ActivityDimensioned } from '../../store/activities/activity-dimensioned';

interface ActivityFormAttributes {
	name: string;
	dimensionedActivities: Array<ActivityDimensioned>;
}

export abstract class ActivityForm<T extends ActivityFormAttributes> extends AbstractFormArray<ActivityDimensioned> {

	activityForm: FormGroup;

	protected constructor(private readonly formBuilder: FormBuilder,
						  private readonly calendarActivity?: T
	) {
		super();
		if (this.calendarActivity) {
			this.activityForm = new FormGroup({
				name: new FormControl(this.calendarActivity.name),
				entries: this.createFormArray(this.calendarActivity.dimensionedActivities)
			});
		} else {
			this.activityForm = new FormGroup({
				name: new FormControl(),
				entries: this.createFormArray([new ActivityDimensioned('', '')])
			});
		}
	}

	getType(): Type<ActivityDimensioned> {
		return ActivityDimensioned;
	}

	getFormEntries(): FormArray {
		return this.activityForm?.get('entries') as FormArray;
	}

	addEntry(): void {
		this.addToFormArray(new ActivityDimensioned('', ''));
	}

	clearFormItem(formControlValue: string): void {
		// this.form.controls[formControlValue].reset();
	}

	hasValue(formControlName: string): boolean {
		return true;
		// return !!this.form.controls[formControlName].value;
	}
}
