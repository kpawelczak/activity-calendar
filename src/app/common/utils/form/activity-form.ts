import { FormBuilder, Validators } from '@angular/forms';
import { Directive } from '@angular/core';
import { ActivityCalendarForm } from './activity-calendar-form';
import { CalendarActivity } from '../../../activities/store/activities/calendar-activity';
import { TemplateActivity } from '../../../templates/template-activity';

@Directive({ selector: 'activity-from' })
export abstract class ActivityForm extends ActivityCalendarForm {

	protected constructor(private readonly formBuilder: FormBuilder) {
		super();
		this.form = this.formBuilder.group({
			name: ['', Validators.required],
			amount: ['', Validators.required]
		});
	}

	fillForm(activity: CalendarActivity | TemplateActivity): void {
		if (activity) {
			this.form.controls['name'].setValue(activity.name);
			this.form.controls['amount'].setValue(activity.amount);
		}
	}
}
