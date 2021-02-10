import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActiveDateService } from '../calendar/active-date.service';
import { Reactive } from '../common/reactive';
import { CalendarFirebaseService } from '../firebase/calendar-firebase.service';
import { switchMap } from 'rxjs/operators';
import { FabricDateUtilService } from '../common/date-util/fabric-date-util.service';
import { CalendarActivity } from '../firebase/month-activities/calendar-activity';

@Component({
	selector: 'act-selected-day',
	template: `
		<ng-container *ngIf="selectedDay">
			Selected Date: {{selectedDay | date:'EEEE, MMMM d, y, hh,mm,ss'}}

			<ac-selected-date-activities [activities]="activities">
			</ac-selected-date-activities>

			<ac-selected-day-activity *ngIf="showActivityForm()"
									  [selectedDay]="selectedDay">
			</ac-selected-day-activity>

		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SelectedDayComponent extends Reactive implements OnInit {

	selectedDay: Date;

	activities: Array<CalendarActivity>;

	constructor(private readonly selectedDayService: ActiveDateService,
				private readonly calendarFirebaseService: CalendarFirebaseService,
				private readonly dateUtilService: FabricDateUtilService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.selectedDayService
			.observeSelectedDate()
			.pipe(
				switchMap((selectedDate: Date) => {
					this.selectedDay = selectedDate;
					return this.calendarFirebaseService
							   .getActivities(selectedDate);
				}),
				this.takeUntil())
			.subscribe((activities: Array<CalendarActivity>) => {
				this.activities = activities;
				this.changeDetectorRef.detectChanges();
			});
	}

	showActivityForm(): boolean {
		return this.dateUtilService.areDatesSame(this.selectedDay, new Date());
	}
}
