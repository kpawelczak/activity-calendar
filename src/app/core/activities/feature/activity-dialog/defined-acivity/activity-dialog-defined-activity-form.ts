import { AbstractFormArray } from '../../../../../common/cdk/form-array.abstract';
import { ActivityEntry } from '../../../../activities-config/store/activity-entry';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Type } from '@angular/core';
import { ActivityConfig } from '../../../../activities-config/store/activity-config';
import { QuantifiedActivity } from '../../../../../common/ui/quantified-activity/quantified-activity';
import { QuantifiedActivityFormEntry } from '../activity-form-entry';

export abstract class ActivityDialogDefinedActivityForm extends AbstractFormArray<QuantifiedActivityFormEntry> {

	activityForm: FormGroup;

	getType(): Type<QuantifiedActivity> {
		return QuantifiedActivity;
	}

	initForm(activityConfig: ActivityConfig): void {
		this.clearFormArray();

		if (activityConfig) {
			this.activityForm = new FormGroup({
				name: new FormControl(activityConfig.name),
				entries: this.createFormArray(this.createActivitiesArray(activityConfig.entries))
			});
		}
	}

	getFormEntries(): FormArray {
		return this.activityForm?.get('entries') as FormArray;
	}

	getUnitValue(i: number): string {
		return this.getFormEntries().controls[i].value.unit;
	}

	private createActivitiesArray(units: Array<ActivityEntry>): Array<QuantifiedActivityFormEntry> {
		return units.map((activityEntry: ActivityEntry) => {
			return { unit: activityEntry.entryUnit, value: '' };
		});
	}
}
