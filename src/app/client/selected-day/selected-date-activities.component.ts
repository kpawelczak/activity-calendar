import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectedDateActivityService } from './selected-date-activity.service';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';
import { Reactive } from '../../common/reactive';

@Component({
	selector: 'ac-selected-date-activities',
	template: `
		<div *ngFor="let activity of activities; let i = index"
			 [class.selected-activity]="isActivitySelected(i)"
			 (click)="selectActivity(activity, i)">
			{{activity.name}} - {{activity.reps}}
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDateActivitiesComponent extends Reactive implements OnInit {

	@Input()
	activities: Array<CalendarActivity>;

	selectedActivityIndex: number;

	constructor(private readonly selectedActivityService: SelectedDateActivityService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.selectedActivityService
			.onActivities()
			.pipe(this.takeUntil())
			.subscribe((activities: any) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});
	}

	selectActivity(activity: CalendarActivity, index: number): void {
		this.selectedActivityIndex = index;
		this.selectedActivityService.selectActivity(activity);
	}

	isActivitySelected(index: number): boolean {
		return this.selectedActivityIndex === index;
	}
}
