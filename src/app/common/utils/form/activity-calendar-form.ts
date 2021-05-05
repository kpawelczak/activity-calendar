import { Reactive } from '../../cdk/reactive';
import { FormGroup } from '@angular/forms';
import { Directive } from '@angular/core';

@Directive({ selector: 'activity-calendar-from' })
export abstract class ActivityCalendarForm extends Reactive {

	form: FormGroup;

	protected constructor() {
		super();
	}

	clearFormItem(formControlValue: string): void {
		this.form.controls[formControlValue].reset();
	}

	hasValue(formControlName: string): boolean {
		return !!this.form.controls[formControlName].value;
	}
}
