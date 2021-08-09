import { AbstractFormArray } from '../../../../common/cdk/form-array.abstract';
import { ActivityConfig } from '../../store/activity-config';
import { Type } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivityEntry } from '../../store/activity-entry';

export abstract class ActivityConfigForm extends AbstractFormArray<ActivityEntry> {

	activityConfigForm: FormGroup;

	protected constructor(private readonly activityConfig: ActivityConfig) {
		super();
		if (this.activityConfig) {
			this.activityConfigForm = new FormGroup({
				name: new FormControl(this.activityConfig.name),
				entries: this.createFormArray(this.activityConfig.entries)
			});
		} else {
			this.activityConfigForm = new FormGroup({
				name: new FormControl(),
				entries: this.createFormArray([new ActivityEntry('')])
			});
		}
	}

	getType(): Type<ActivityEntry> {
		return ActivityEntry;
	}

	getFormEntries(): FormArray {
		return this.activityConfigForm?.get('entries') as FormArray;
	}

	addEntry(): void {
		this.addToFormArray(new ActivityEntry(''));
	}

	clearFormItem(formControlValue: string): void {
		// this.form.controls[formControlValue].reset();
	}

	hasValue(formControlName: string): boolean {
		return true;
		// return !!this.form.controls[formControlName].value;
	}
}
