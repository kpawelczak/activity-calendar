import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { TemplateActivity } from '../../../../repositories/templates/template-activity';
import { CalendarActivity } from '../../../../firebase/activities/month-activities/calendar-activity';
import { v4 as uuidv4 } from 'uuid';
import { SelectedActivityService } from '../activity/selected-activity.service';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
	selector: 'ac-selected-day-template-activity',
	template: `
		<span>{{1}}</span>

		<span>{{calendarActivity.name}}</span>

		<span>{{calendarActivity.reps}}</span>

		<mat-checkbox (change)="addActivity($event)"></mat-checkbox>
	`,
	host: {
		'[class.ac-selected-date-activity]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayTemplateActivityComponent implements OnChanges {

	@Input()
	selectedDay: Date;

	@Input()
	templateActivity: TemplateActivity;

	calendarActivity: CalendarActivity;

	constructor(private readonly selectedActivityService: SelectedActivityService) {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.templateActivity) {
			// register template ?
			const uuid = uuidv4(); // wont work after refresh
			this.calendarActivity = new CalendarActivity(this.selectedDay.getTime(),
				uuid,
				this.templateActivity.name,
				this.templateActivity.reps);
		}
	}

	addActivity(checkboxChange: MatCheckboxChange): void {

		if (checkboxChange.checked) {
			this.selectedActivityService.addActivity(this.selectedDay, this.calendarActivity);
		} else {
			this.selectedActivityService.deleteActivity(this.selectedDay, this.calendarActivity);
		}
	}

}
