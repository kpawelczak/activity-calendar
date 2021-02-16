import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../../common/reactive';
import { FabricDateUtilService } from '../../common/date-util/fabric-date-util.service';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';
import { FirestoreMonthActivitiesRepository } from '../../firebase/activities/month-activities/firestore-month-activities.repository';
import { distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SelectedDateActivitiesRepository } from './selected-date-activities.repository';

@Component({
	selector: 'act-selected-day',
	template: `
		<h2>{{selectedDay | date:'EEEE, MMMM d, y'}}</h2>

		<ac-selected-date-activities [selectedDay]="selectedDay"
									 [isSelectedDayToday]="isSelectedDayToday"></ac-selected-date-activities>

		<ac-selected-activity-form *ngIf="isSelectedDayToday()"
								   [selectedDay]="selectedDay">
		</ac-selected-activity-form>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayComponent extends Reactive implements OnInit {

	selectedDay: Date;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly selectedDateActivitiesService: SelectedDateActivitiesRepository,
				private readonly monthActivitiesRepository: FirestoreMonthActivitiesRepository,
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
				this.takeUntil()
			)
			.subscribe((selectedDate: Date) => {
				this.selectedDay = selectedDate;
				this.selectedDateActivitiesService.selectDayActivities(this.selectedDay);
				this.changeDetectorRef.detectChanges();
			});
	}

	isSelectedDayToday(): boolean {
		return this.selectedDay ? this.dateUtilService.areDatesSame(this.selectedDay, new Date()) : false;
	}
}
