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
import { TemplateActivity } from '../../../../repositories/templates/template-activity';
import { CalendarActivity } from '../../../../firebase/activities/month-activities/calendar-activity';
import { v4 as uuidv4 } from 'uuid';
import { SelectedActivityService } from '../activity/selected-activity.service';
import { Reactive } from '../../../../common/reactive';
import { SelectedDayTemplateActivityRepository } from './selected-day-template-activity.repository';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';

@Component({
	selector: 'ac-selected-day-template-activity',
	template: `
		<div (click)="manageActivity()"
			 class="ac-selected-date-activity">
			<span>{{index + 1}}</span>

			<span>{{calendarActivity.name}}</span>

			<span>{{calendarActivity.reps}}</span>

			<mat-checkbox [checked]="checked"></mat-checkbox>
		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayTemplateActivityComponent extends Reactive implements OnChanges, OnInit {

	@Input()
	index: number;

	@Input()
	selectedDay: Date;

	@Input()
	templateActivity: TemplateActivity;

	calendarActivity: CalendarActivity;

	checked: boolean = false;

	constructor(private readonly selectedActivityService: SelectedActivityService,
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
				this.templateActivity.reps,
				uuid,
				this.templateActivity.templateUUID
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
			this.selectedActivityService.addActivity(this.selectedDay, this.calendarActivity);
		} else {
			this.selectedActivityService.deleteActivity(this.selectedDay, this.calendarActivity);
		}
	}

}