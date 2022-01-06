import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	OnInit,
	SimpleChanges,
	ViewEncapsulation
} from '@angular/core';
import { TemplateActivity } from '../../../templates/template-activity';
import { v4 as uuidv4 } from 'uuid';
import { SelectedActivityService } from '../../store/selected-activity/selected-activity.service';
import { Reactive } from '../../../../common/cdk/reactive';
import { SelectedDayTemplateActivityRepository } from '../../store/template/selected-day-template-activity.repository';
import { CalendarActivity } from '../../store/activities/calendar-activity';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
	selector: 'ac-activity-template',
	template: `
		<div *ngIf="templateActivity.name"
			 (click)="manageActivity()"
			 class="ac-selected-date-activity">
			<span>{{index + 1}}</span>

			<span>{{calendarActivity.name}}</span>

			<span>{{calendarActivity.quantifiedActivities | quantifiedActivity}}</span>

			<mat-checkbox [checked]="checked"></mat-checkbox>
		</div>
	`,
	host: {
		'[class.ac-activity-template]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivityTemplateComponent extends Reactive implements OnChanges, OnInit {

	@Input()
	index: number;

	@Input()
	selectedDay: Date;

	@Input()
	templateActivity: TemplateActivity;

	calendarActivity: CalendarActivity;

	checked: boolean = false;

	constructor(private readonly selectedDayActivityService: SelectedActivityService,
				private readonly selectedDayTemplateActivityRepository: SelectedDayTemplateActivityRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.templateActivity) {

			const uuid = uuidv4();
			this.calendarActivity = new CalendarActivity(
				this.selectedDay.getTime(),
				this.templateActivity.name,
				this.templateActivity.quantifiedActivities,
				{
					activityUUID: uuid,
					assignedTemplateUUID: this.templateActivity.templateUUID
				}
			);
		}
	}

	ngOnInit() {
		this.selectedDayTemplateActivityRepository
			.onActivity(this.templateActivity.templateUUID)
			.pipe(
				map((calendarActivity: CalendarActivity) => {
					if (!calendarActivity) {
						this.checked = false;
						this.changeDetectorRef.detectChanges();
					}

					return calendarActivity;
				}),
				filter((calendarActivity: CalendarActivity) => !!calendarActivity),
				distinctUntilChanged(),
				this.takeUntil())
			.subscribe((calendarActivity: CalendarActivity) => {
				this.checked = true;
				this.calendarActivity.setActivityUUID(calendarActivity.getActivityUUID());
				this.calendarActivity.setTemplateUUID(calendarActivity.getAssignedTemplateUUID());
				this.changeDetectorRef.detectChanges();
			});
	}

	manageActivity(): void {
		this.checked = !this.checked;
		if (this.checked) {
			this.selectedDayActivityService.addActivity({
				selectedDate: this.selectedDay,
				name: this.calendarActivity.name,
				entries: this.calendarActivity.quantifiedActivities,
				activityUUID: this.calendarActivity.getActivityUUID(),
				templateUUID: this.calendarActivity.getAssignedTemplateUUID()
			});
		} else {
			this.selectedDayActivityService.deleteActivity(this.selectedDay, this.calendarActivity);
		}
	}

}
