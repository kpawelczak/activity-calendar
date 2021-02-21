import { Injectable } from '@angular/core';
import { SelectedDayActivitiesRepository } from '../activities/selected-day-activities.repository';
import { ActivitiesRepository } from '../../../../repositories/activities/activities.repository';
import { v4 as uuidv4 } from 'uuid';
import { CalendarActivity } from '../../../../common/models/calendar-activity';
import { FirestoreActivityService } from '../../../../firebase/activities/activity/firestore-activity.service';


@Injectable()
export class SelectedDayActivityService {

	constructor(private readonly firestoreActivityService: FirestoreActivityService,
				private readonly selectedDateActivitiesService: SelectedDayActivitiesRepository,
				private readonly activitiesRepository: ActivitiesRepository) {
	}

	addActivity(selectedDate: Date, calendarActivity: CalendarActivity): Promise<void> {
		if (!calendarActivity.getActivityUUID()) {
			calendarActivity.setActivityUUID(uuidv4());
		}
		return this.firestoreActivityService
				   .addActivity(calendarActivity)
				   .then(() => {
					   this.activitiesRepository.addMonthActivity(calendarActivity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}

	updateActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {

		return this.firestoreActivityService
				   .updateActivity(activity)
				   .then(() => {
					   this.activitiesRepository.updateMonthActivities(activity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}

	deleteActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {

		return this.firestoreActivityService
				   .deleteActivity(activity)
				   .then(() => {
					   this.activitiesRepository.deleteActivity(activity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}
}
