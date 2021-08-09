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
import { filter, map, switchMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ActivityDialogComponent } from './activity-dialog/activity-dialog.component';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { DateUtils } from '../../../common/utils/date-util/date-utils';
import { TemplateActivity } from '../../templates/template-activity';
import { TemplateRepository } from '../../templates/store/template/template.repository';
import { WeekdayTemplate } from '../../templates/store/weekday-template';
import { ActivitiesRepository } from '../store/activities/activities.repository';
import { SelectedActivitiesRepository } from '../store/selected-activities/selected-activities.repository';
import { SelectedActivitiesService } from '../store/selected-activities/selected-activities.service';
import { SelectedDayActiveTemplateSetRepository } from '../store/template/selected-day-active-template-set.repository';
import { TemplatesRepository } from '../../templates/store/templates/templates.repository';

@Component({
	selector: 'ac-selected-day',
	template: `
		<h2 class="selected-activity-day">{{selectedDay | date:'EEEE d MMMM y'}}</h2>

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
										[templateActivities]="templateActivities"
										[weekdayTemplates]="weekdayTemplates"
										[activeWeekdayTemplate]="activeWeekdayTemplate"></ac-activities-template>

			</mat-tab>

		</mat-tab-group>

		<div *ngIf="isSelectedDayToday()"
			 class="add-button-wrapper">

			<button mat-icon-button
					[type]="'button'"
					[disableRipple]="true"
					(click)="openActivityForm()">
				<mat-icon>add_circle</mat-icon>
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

	weekdayTemplates: Array<WeekdayTemplate>;

	templateActivities: Array<TemplateActivity>;

	activeWeekdayTemplate: number;

	constructor(private readonly templateRepository: TemplateRepository,
				private readonly templatesRepository: TemplatesRepository,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly selectedActivitiesRepository: SelectedActivitiesRepository,
				private readonly selectedActivitiesService: SelectedActivitiesService,
				private readonly selectedDayActiveTemplateSetRepository: SelectedDayActiveTemplateSetRepository,
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
		this.selectedDayActiveTemplateSetRepository
			.onValues()
			.pipe(
				switchMap((activeWeekdayTemplate: number) => {
					this.activeWeekdayTemplate = activeWeekdayTemplate;
					return this.templateRepository
							   .onWeekdayTemplate(activeWeekdayTemplate);
				}),
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

		this.templatesRepository
			.onValues()
			.pipe(
				this.takeUntil()
			)
			.subscribe((weekdayTemplates: Array<WeekdayTemplate>) => {
				this.weekdayTemplates = weekdayTemplates;
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

	canShowActivities(): boolean {
		return this.activities?.length > 0;
	}

	canShowTemplates(): boolean {
		return this.isSelectedDayToday() && this.templateActivities?.length > 0;
	}

}
