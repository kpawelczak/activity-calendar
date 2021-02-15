import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectedDateActivityService } from './selected-date-activity.service';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';
import { Reactive } from '../../common/reactive';
import { SelectedDateActivitiesService } from './selected-date-activities.service';

@Component({
	selector: 'ac-selected-date-activities',
	template: `
		<div *ngFor="let activity of activities; let i = index"
			 [class.selected-activity]="isActivitySelected(activity)"
			 (click)="selectActivity(activity)">
			{{activity.name}} - {{activity.reps}}
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDateActivitiesComponent extends Reactive implements OnInit {

	@Input()
	activities: Array<CalendarActivity>;

	selectedActivity: CalendarActivity;

	constructor(private readonly selectedActivityService: SelectedDateActivityService,
				private readonly selectedActivitiesService: SelectedDateActivitiesService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.selectedActivitiesService
			.onActivities()
			.pipe(this.takeUntil())
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});
	}

	selectActivity(activity: CalendarActivity): void {
		this.selectedActivity = activity;
		this.selectedActivityService.selectActivity(activity);
	}

	isActivitySelected(activity: CalendarActivity): boolean {
		return this.selectedActivity && this.selectedActivity.UUID === activity.UUID;
	}
}
