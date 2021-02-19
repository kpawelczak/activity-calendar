import { FormBuilder, Validators } from '@angular/forms';
import { Directive } from '@angular/core';
import { ActivityCalendarForm } from './activity-calendar-form';

@Directive({ selector: 'activity-from' })
export abstract class ActivityForm extends ActivityCalendarForm {

	protected constructor(private readonly formBuilder: FormBuilder) {
		super();
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			reps: ['', Validators.required]
		});
	}

	fillForm(activity: any): void { // TODO CalendarActivity => Activity
		if (activity) {
			this.form.controls['name'].setValue(activity.name);
			this.form.controls['reps'].setValue(activity.reps);
		}
	}
}
