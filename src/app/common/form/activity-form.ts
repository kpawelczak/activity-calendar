import { FormBuilder, Validators } from '@angular/forms';
import { Directive } from '@angular/core';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';
import { ActivityCalendarForm } from './activity-calendar-form';

@Directive({ selector: 'ac-from' })
export abstract class ActivityForm extends ActivityCalendarForm {

	protected constructor(private readonly formBuilder: FormBuilder) {
		super();
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			reps: ['', Validators.required]
		});
	}

	fillForm(activity: CalendarActivity): void {
		if (activity) {
			this.form.controls['name'].setValue(activity.name);
			this.form.controls['reps'].setValue(activity.reps);
		}
	}
}
