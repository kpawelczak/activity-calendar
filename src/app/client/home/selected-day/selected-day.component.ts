import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../../../common/reactive';
import { FabricDateUtilService } from '../../../common/date-util/fabric-date-util.service';
import { ActivitiesRepository } from '../../../repositories/activities/activities.repository';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { SelectedDayActivitiesRepository } from './activities/selected-day-activities.repository';
import { WeekdayTemplate } from '../../../repositories/templates/weekday-template';
import { TemplateActivity } from '../../../common/models/template-activity';
import { FirebaseTemplatesService } from '../../../firebase/templates/firebase-templates.service';
import { WeekdayTemplateRepository } from '../../../repositories/templates/weekday-template.repository';
import { Weekday } from '../../../repositories/templates/weekday';
import { MatDialog } from '@angular/material/dialog';
import { SelectedDayActivityFormComponent } from './activity/selected-day-activity-form.component';
import { CalendarActivity } from '../../../common/models/calendar-activity';

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

		<div class="selected-day-add-activity-button-wrapper">

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

	weekday: Weekday;

	activities: Array<CalendarActivity>;

	templateActivities: Array<TemplateActivity>;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly selectedDayActivitiesRepository: SelectedDayActivitiesRepository,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly weekdayTemplateRepository: WeekdayTemplateRepository,
				private readonly dateUtilService: FabricDateUtilService,
				private readonly matDialog: MatDialog,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.activitiesRepository
			.onMonthActivities()
			.pipe(
				switchMap((monthActivities: Array<CalendarActivity>) => {
					this.selectedDayActivitiesRepository.setMonthActivities(monthActivities);
					return this.selectedDayService.observeSelectedDate();
				}),
				distinctUntilChanged(),
				switchMap((selectedDate: Date) => {
					this.selectedDay = selectedDate;
					this.selectedDayActivitiesRepository.selectDayActivities(this.selectedDay);
					this.setWeekday(selectedDate);
					this.changeDetectorRef.detectChanges();
					return this.weekdayTemplateRepository
							   .onTemplate(this.weekday);
				}),
				filter(() => this.isSelectedDayToday()),
				filter((weekdayTemplate: WeekdayTemplate) => !!weekdayTemplate),
				map((weekdayTemplate: WeekdayTemplate) => {
					if (weekdayTemplate.templates.length === 0) {
						this.firebaseTemplatesService.getTemplate(this.weekday);
					}
					return weekdayTemplate.templates;
				}),
				filter((templateActivities: Array<TemplateActivity>) => templateActivities.length !== 0),
				this.takeUntil()
			)
			.subscribe((templateActivities: Array<TemplateActivity>) => {
				this.templateActivities = templateActivities;
				this.changeDetectorRef.detectChanges();
			});

		this.selectedDayActivitiesRepository
			.onActivities()
			.pipe(this.takeUntil())
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});
	}

	openActivityForm(): void {
		this.matDialog.open(SelectedDayActivityFormComponent, {
			panelClass: 'activity-calendar-dialog',
			data: {
				selectedDay: this.selectedDay
			}
		});
	}

	isSelectedDayToday(): boolean {
		return this.selectedDay ? this.dateUtilService.areDatesSame(this.selectedDay, new Date()) : false;
	}

	getActivitiesLabel(): string {
		return this.isSelectedDayToday() ? 'Activities' : 'Past activities';
	}

	setWeekday(date: Date): void {
		this.weekday = date.getDay();
	}

	canShowActivities(): boolean {
		return this.activities?.length > 0;
	}

	canShowTemplates(): boolean {
		return this.isSelectedDayToday() && this.templateActivities?.length > 0;
	}
}
