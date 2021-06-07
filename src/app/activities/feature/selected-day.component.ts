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
import { Reactive } from '../../common/cdk/reactive';
import { filter, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { DateUtils } from '../../common/utils/date-util/date-utils';
import { Weekday } from '../../templates/weekday';
import { TemplateActivity } from '../../templates/template-activity';
import { TemplateRepository } from '../../templates/store/template/template.repository';
import { WeekdayTemplate } from '../../templates/store/weekday-template';
import { ActivitiesRepository } from '../store/activities/activities.repository';
import { SelectedDayTemplateActivityRepository } from '../store/template/selected-day-template-activity.repository';
import { SelectedActivitiesRepository } from '../store/selected-activities/selected-activities.repository';
import { SelectedActivitiesService } from '../store/selected-activities/selected-activities.service';

@Component({
	selector: 'ac-selected-day',
	template: `
		<h2 class="selected-activity-day">{{selectedDay | date:'EEEE, MMMM d, y'}}</h2>

		<mat-tab-group *ngIf="canShowActivities() || canShowTemplates()"
					   [class.tab-group-disabled]="!isSelectedDayToday()"
					   mat-stretch-tabs dynamicHeight>

			<mat-tab *ngIf="canShowActivities()"
					 [label]="getActivitiesLabel()">

				<ac-activities-list [selectedDay]="selectedDay"
									[activities]="activities"
									[isSelectedDayToday]="isSelectedDayToday"></ac-activities-list>

			</mat-tab>

			<mat-tab *ngIf="canShowTemplates()"
					 [label]="'Template'">

				<ac-activities-template [selectedDay]="selectedDay"
										[templateActivities]="templateActivities"></ac-activities-template>

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
	host: {
		'[class.ac-selected-day]': 'true'
	},
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
				private readonly selectedActivitiesRepository: SelectedActivitiesRepository,
				private readonly selectedActivitiesService: SelectedActivitiesService,
				private readonly matDialog: MatDialog,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.selectedDay) {
			this.selectedActivitiesService.selectActivities(this.selectedDay);
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
			.onValues()
			.pipe(
				this.takeUntil()
			)
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});
	}

	openActivityForm(): void {
		this.matDialog
			.open(ActivityDialogComponent, {
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
