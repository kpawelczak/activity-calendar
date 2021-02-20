import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../../../common/reactive';
import { FabricDateUtilService } from '../../../common/date-util/fabric-date-util.service';
import { CalendarActivity } from '../../../firebase/activities/month-activities/calendar-activity';
import { MonthActivitiesRepository } from '../../../repositories/activities/month-activities.repository';
import { distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { SelectedDayActivitiesRepository } from './activities/selected-day-activities.repository';
import { WeekdayTemplate } from '../../../repositories/templates/weekday-template';
import { TemplateActivity } from '../../../repositories/templates/template-activity';
import { FirebaseTemplatesService } from '../../../firebase/templates/firebase-templates.service';
import { WeekdayTemplateRepository } from '../../../repositories/templates/weekday-template.repository';
import { Weekday } from '../../../repositories/templates/weekday';

@Component({
	selector: 'ac-selected-day',
	template: `
		<h2 class="selected-activity-day">{{selectedDay | date:'EEEE, MMMM d, y'}}</h2>

		<mat-tab-group mat-stretch-tabs dynamicHeight>
			<!--Todo mattab -> ngif no template no activities-->
			<mat-tab *ngIf="activities?.length > 0"
					 [label]="getActivitiesLabel()">

				<ac-selected-date-activities [selectedDay]="selectedDay"
											 [activities]="activities"
											 [isSelectedDayToday]="isSelectedDayToday"></ac-selected-date-activities>

			</mat-tab>

			<mat-tab *ngIf="canShowTemplates()"
					 label="Template">

				<ac-selected-day-template [selectedDay]="selectedDay"
										  [templateActivities]="templateActivities"></ac-selected-day-template>

			</mat-tab>

		</mat-tab-group>

		<ac-selected-activity-form *ngIf="isSelectedDayToday()"
								   [selectedDay]="selectedDay">
		</ac-selected-activity-form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayComponent extends Reactive implements OnInit {

	selectedDay: Date;

	weekday: Weekday = 1;

	activities: Array<CalendarActivity>;

	templateActivities: Array<TemplateActivity>;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly selectedDateActivitiesService: SelectedDayActivitiesRepository,
				private readonly monthActivitiesRepository: MonthActivitiesRepository,
				private readonly firebaseTemplatesService: FirebaseTemplatesService,
				private readonly weekdayTemplateRepository: WeekdayTemplateRepository,
				private readonly dateUtilService: FabricDateUtilService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.monthActivitiesRepository
			.onMonthActivities()
			.pipe(
				switchMap((monthActivities: Array<CalendarActivity>) => {
					this.selectedDateActivitiesService.setMonthActivities(monthActivities);
					return this.selectedDayService.observeSelectedDate();
				}),
				distinctUntilChanged(),
				switchMap((selectedDate: Date) => {
					this.selectedDay = selectedDate;
					this.selectedDateActivitiesService.selectDayActivities(this.selectedDay);
					this.setWeekdayName(selectedDate);
					this.changeDetectorRef.detectChanges();
					return this.weekdayTemplateRepository
							   .onTemplate(this.weekday);
				}),
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

		this.selectedDateActivitiesService
			.onActivities()
			.pipe(this.takeUntil())
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});
	}

	isSelectedDayToday(): boolean {
		return this.selectedDay ? this.dateUtilService.areDatesSame(this.selectedDay, new Date()) : false;
	}

	getActivitiesLabel(): string {
		return this.isSelectedDayToday() ? 'Activities' : 'Past activities';
	}

	setWeekdayName(date: Date): void {
		this.weekday = date.getDay();
	}

	canShowTemplates(): boolean {
		return this.isSelectedDayToday() && this.templateActivities?.length > 0;
	}
}
