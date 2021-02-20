import { Injectable } from '@angular/core';
import { CalendarActivity } from '../../../../firebase/activities/month-activities/calendar-activity';
import { SelectedDayActivitiesRepository } from '../activities/selected-day-activities.repository';
import { MonthActivitiesRepository } from '../../../../repositories/activities/month-activities.repository';
import { v4 as uuidv4 } from 'uuid';
import { FirestoreSelectedActivityService } from '../../../../firebase/activities/selected-activity/firestore-selected-activity.service';


@Injectable()
export class SelectedActivityService {

	constructor(private readonly firestoreSelectedActivityService: FirestoreSelectedActivityService,
				private readonly selectedDateActivitiesService: SelectedDayActivitiesRepository,
				private readonly monthActivitiesRepository: MonthActivitiesRepository) {
	}

	addActivity(selectedDate: Date, calendarActivity: CalendarActivity): Promise<void> {
		const dayInSeconds = selectedDate.getTime(),
			uuid = calendarActivity.activityUUID ? calendarActivity.activityUUID : uuidv4(),
			newCalendarActivity = new CalendarActivity(dayInSeconds, uuid, calendarActivity.name, calendarActivity.reps);

		return this.firestoreSelectedActivityService
				   .addActivity(calendarActivity)
				   .then(() => {
					   this.monthActivitiesRepository.addMonthActivity(newCalendarActivity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}

	updateActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {

		return this.firestoreSelectedActivityService
				   .updateActivity(activity)
				   .then(() => {
					   this.monthActivitiesRepository.updateMonthActivities(activity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}

	deleteActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {

		return this.firestoreSelectedActivityService
				   .deleteActivity(activity)
				   .then(() => {
					   this.monthActivitiesRepository.deleteActivity(activity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}
}
