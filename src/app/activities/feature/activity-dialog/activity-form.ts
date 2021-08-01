import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Directive, Type } from '@angular/core';
import { CalendarActivity } from '../../store/activities/calendar-activity';
import { TemplateActivity } from '../../../templates/template-activity';
import { AbstractFormArray } from '../../../common/cdk/form-array.abstract';
import { ActivityDimensioned } from '../../store/activities/activity-dimensioned';

@Directive({ selector: 'activity-from' })
export abstract class ActivityForm extends AbstractFormArray<ActivityDimensioned> {

	protected constructor(private readonly formBuilder: FormBuilder,
						  private readonly calendarActivity?: CalendarActivity
	) {
		super();
		if (this.calendarActivity) {
			this.form = new FormGroup({
				name: new FormControl(this.calendarActivity.name),
				entries: this.createFormArray(this.calendarActivity.dimensionedActivities)
			});
		} else {
			this.form = new FormGroup({
				name: new FormControl(),
				entries: this.createFormArray([new ActivityDimensioned('', '')])
			});
		}
	}

	fillForm(activity: CalendarActivity | TemplateActivity): void {
		if (activity) {
			this.form.controls['name'].setValue(activity.name);
		}
	}

	getType(): Type<ActivityDimensioned> {
		return ActivityDimensioned;
	}

	getFormEntries(): FormArray {
		return this.form?.get('entries') as FormArray;
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
