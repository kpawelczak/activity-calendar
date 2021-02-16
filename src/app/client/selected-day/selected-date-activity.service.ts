import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CalendarActivity } from '../../firebase/activities/month-activities/calendar-activity';
import { FirestoreSelectedDayActivitiesService } from '../../firebase/activities/selected-day-activities/firestore-selected-day-activities.service';
import { FirestoreMonthActivitiesRepository } from '../../firebase/activities/month-activities/firestore-month-activities.repository';
import { v4 as uuidv4 } from 'uuid';
import { SelectedDateActivitiesService } from './selected-date-activities.service';

@Injectable()
export class SelectedDateActivityService {

	private readonly activity$ = new Subject<CalendarActivity>();

	constructor(private readonly firestoreSelectedDayActivitiesService: FirestoreSelectedDayActivitiesService,
				private readonly selectedDateActivitiesService: SelectedDateActivitiesService,
				private readonly monthActivitiesRepository: FirestoreMonthActivitiesRepository) {
	}

	onActivity(): Observable<CalendarActivity> {
		return this.activity$.asObservable();
	}

	selectActivity(activity: CalendarActivity): void {
		this.activity$.next(activity);
	}

	addActivity(selectedDate: Date, formValues: CalendarActivity): Promise<void> {
		const dayInSeconds = selectedDate.getTime(),
			uuid = uuidv4(),
			calendarActivity = new CalendarActivity(dayInSeconds, uuid, formValues.name, formValues.reps);

		return this.firestoreSelectedDayActivitiesService
				   .addActivity(calendarActivity)
				   .then(() => {
					   this.monthActivitiesRepository.addMonthActivity(calendarActivity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}

	updateActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {

		return this.firestoreSelectedDayActivitiesService
				   .updateActivity(activity)
				   .then(() => {
					   this.monthActivitiesRepository.updateMonthActivities(activity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}
}
