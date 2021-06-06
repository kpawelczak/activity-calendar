import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../../../common/cdk/reactive';
import { ActivitiesRepository } from '../../../services/repositories/activities/activities.repository';
import { filter, map, switchMap } from 'rxjs/operators';
import { SelectedDayActivitiesRepository } from './activities/selected-day-activities.repository';
import { MatDialog } from '@angular/material/dialog';
import { SelectedDayActivityDialogComponent } from './activity/selected-day-activity-dialog.component';
import { CalendarActivity } from '../../../common/models/calendar-activity';
import { DateUtils } from '../../../common/utils/date-util/date-utils';
import { Weekday } from '../../../templates/weekday';
import { TemplateActivity } from '../../../templates/template-activity';
import { TemplateRepository } from '../../../templates/store/template/template.repository';
import { WeekdayTemplate } from '../../../templates/store/weekday-template';
import { combineLatest } from 'rxjs';

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
export class SelectedDayComponent extends Reactive implements OnInit {

	selectedDay: Date;

	activities: Array<CalendarActivity>;

	templateActivities: Array<TemplateActivity>;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly selectedDayActivitiesRepository: SelectedDayActivitiesRepository,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly templateRepository: TemplateRepository,
				private readonly matDialog: MatDialog,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		combineLatest([
			this.activitiesRepository.onValues(),
			this.selectedDayService.observeSelectedDate()
		])
			.pipe(
				switchMap(([monthActivities, selectedDate]: [Array<CalendarActivity>, Date]) => {
					this.selectDay(selectedDate);
					this.selectedDayActivitiesRepository.selectDayActivities(this.selectedDay, monthActivities);
					this.changeDetectorRef.detectChanges();
					return this.templateRepository
							   .onWeekdayTemplate(this.getWeekDay());
				}),
				filter(() => this.isSelectedDayToday()),
				map((weekdayTemplate: WeekdayTemplate) => weekdayTemplate.getTemplates()),
				this.takeUntil()
			)
			.subscribe((templateActivities: Array<TemplateActivity>) => {
				this.templateActivities = templateActivities;
				this.changeDetectorRef.detectChanges();
			});

		this.selectedDayActivitiesRepository
			.onValues()
			.pipe(this.takeUntil())
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
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
		return this.selectedDay.getDay();
	}

	canShowActivities(): boolean {
		return this.activities?.length > 0;
	}

	canShowTemplates(): boolean {
		return this.isSelectedDayToday() && this.templateActivities?.length > 0;
	}

	private selectDay(date: Date): void {
		if (!DateUtils.areDatesSame(this.selectedDay, date)) {
			this.selectedDay = date;
		}
	}
}
