import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Type } from '@angular/core';
import { AbstractFormArray } from '../../../../../common/cdk/form-array.abstract';
import { QuantifiedActivity } from '../../../../../common/ui/quantified-activity/quantified-activity';

export interface ActivityFormAttributes {
	name: string;
	quantifiedActivities: Array<QuantifiedActivity>;
}

export abstract class ActivityForm<T extends ActivityFormAttributes> extends AbstractFormArray<QuantifiedActivity> {

	activityForm: FormGroup;

	protected constructor() {
		super();
	}

	getType(): Type<QuantifiedActivity> {
		return QuantifiedActivity;
	}

	initForm(activity: T): void {
		if (activity) {
			this.activityForm = new FormGroup({
				name: new FormControl(activity.name),
				entries: this.createFormArray(activity.quantifiedActivities)
			});
		} else {
			this.activityForm = new FormGroup({
				name: new FormControl(),
				entries: this.createFormArray([new QuantifiedActivity('', '')])
			});
		}
		this.activityForm.controls['name'].setValidators(Validators.required);
		this.activityForm.controls['entries'].setValidators(Validators.required);
	}

	getFormEntries(): FormArray {
		return this.activityForm?.get('entries') as FormArray;
	}

	addEntry(): void {
		this.addToFormArray(new QuantifiedActivity('', ''));
	}
}
