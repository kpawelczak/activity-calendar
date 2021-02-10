import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CalendarActivity } from '../firebase/month-activities/calendar-activity';
import { SelectedDateActivityService } from './selected-date-activity.service';

@Component({
	selector: 'ac-selected-date-activities',
	template: `
		<div *ngFor="let activity of activities"
			 (click)="selectActivity(activity)">
			{{activity.name}} - {{activity.reps}}
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDateActivitiesComponent {

	@Input()
	activities: Array<CalendarActivity>;

	constructor(private readonly selectedActivityService: SelectedDateActivityService) {
	}

	selectActivity(activity: CalendarActivity): void {
		this.selectedActivityService.next(activity);
	}

}
