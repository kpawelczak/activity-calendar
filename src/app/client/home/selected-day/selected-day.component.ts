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
import { Reactive } from '../../../common/cdk/reactive';
import { filter, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SelectedDayActivityDialogComponent } from './activity/selected-day-activity-dialog.component';
import { CalendarActivity } from '../../../common/models/calendar-activity';
import { DateUtils } from '../../../common/utils/date-util/date-utils';
import { Weekday } from '../../../templates/weekday';
import { TemplateActivity } from '../../../templates/template-activity';
import { TemplateRepository } from '../../../templates/store/template/template.repository';
import { WeekdayTemplate } from '../../../templates/store/weekday-template';
import { ActivitiesRepository } from '../../../services/repositories/activities/activities.repository';
import { SelectedDayTemplateActivityRepository } from './template/selected-day-template-activity.repository';
import { SelectedActivitiesDateService } from './selected-activities-date.service';
import { SelectedActivitiesRepository } from './selected-activities.repository';

@Component({
	selector: 'ac-selected-day',
	template: `
		<h2 class="selected-activity-day">{{selectedDay | date:'EEEE, MMMM d, y'}}</h2>

		<mat-tab-group *ngIf="canShowActivities() || canShowTemplates()"
					   [class.tab-group-disabled]="!isSelectedDayToday()"
					   mat-stretch-tabs dynamicHeight>

			<mat-tab *ngIf="canShowActivities()"
					 [label]="getActivitiesLabel()">

				<ac-selected-date-activities [selectedDay]="selectedDay"
											 [activities]="activities"
											 [isSelectedDayToday]="isSelectedDayToday"></ac-selected-date-activities>

			</mat-tab>

			<mat-tab *ngIf="canShowTemplates()"
					 [label]="'Template'">

				<ac-selected-day-template [selectedDay]="selectedDay"
										  [templateActivities]="templateActivities"></ac-selected-day-template>

			</mat-tab>

		</mat-tab-group>

		<div *ngIf="isSelectedDayToday()"
			 class="selected-day-add-activity-button-wrapper">

			<button mat-icon-button
					[type]="'button'"
					[disableRipple]="true"
					(click)="openActivityForm()">
				<mat-icon (click)="openActivityForm()">add_circle</mat-icon>
			</button>

		</div>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayComponent extends Reactive implements OnChanges, OnInit {

	@Input()
	selectedDay: Date;

	activities: Array<CalendarActivity>;

	templateActivities: Array<TemplateActivity>;

	constructor(private readonly templateRepository: TemplateRepository,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly selectedDayTemplateActivityRepository: SelectedDayTemplateActivityRepository,
				private readonly selectedActivitiesDateService: SelectedActivitiesDateService,
				private readonly selectedActivitiesRepository: SelectedActivitiesRepository,
				private readonly matDialog: MatDialog,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.selectedDay) {
			this.selectedActivitiesDateService.next(this.selectedDay);
		}
	}

	ngOnInit() {
		this.templateRepository
			.onWeekdayTemplate(this.getWeekDay())
			.pipe(
				filter(() => this.isSelectedDayToday()),
				map((weekdayTemplate: WeekdayTemplate) => weekdayTemplate.getTemplates()),
				this.takeUntil()
			)
			.subscribe((templateActivities: Array<TemplateActivity>) => {
				this.templateActivities = templateActivities;
				this.changeDetectorRef.detectChanges();
			});

		this.selectedActivitiesRepository
			.onActivities()
			.pipe(
				this.takeUntil()
			)
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
				console.log(activities);
				this.changeDetectorRef.detectChanges();
			});
	}

	openActivityForm(): void {
		this.matDialog
			.open(SelectedDayActivityDialogComponent, {
				panelClass: 'activity-calendar-dialog',
				data: {
					selectedDay: this.selectedDay
				}
			});
	}

	isSelectedDayToday(): boolean {
		return this.selectedDay ? DateUtils.areDatesSame(this.selectedDay, new Date()) : false;
	}

	getActivitiesLabel(): string {
		return this.isSelectedDayToday() ? 'Activities' : 'Past activities';
	}

	getWeekDay(): Weekday {
		return new Date().getDay();
	}

	canShowActivities(): boolean {
		return this.activities?.length > 0;
	}

	canShowTemplates(): boolean {
		return this.isSelectedDayToday() && this.templateActivities?.length > 0;
	}

}
