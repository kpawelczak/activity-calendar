import { Injectable } from '@angular/core';
import { SelectedDayActivitiesRepository } from '../activities/selected-day-activities.repository';
import { ActivitiesRepository } from '../../../../services/repositories/activities/activities.repository';
import { v4 as uuidv4 } from 'uuid';
import { CalendarActivity } from '../../../../common/models/calendar-activity';
import { FirebaseActivityService } from '../../../../services/firebase/activities/activity/firebase-activity.service';
import { ActivitiesCountRepository } from '../../../../services/repositories/activities/count/activities-count.repository';


@Injectable()
export class SelectedDayActivityService {

	constructor(private readonly firebaseActivityService: FirebaseActivityService,
				private readonly selectedDateActivitiesService: SelectedDayActivitiesRepository,
				private readonly activitiesCountRepository: ActivitiesCountRepository,
				private readonly activitiesRepository: ActivitiesRepository) {
	}

	addActivity(selectedDate: Date, calendarActivity: CalendarActivity): Promise<void> {
		if (!calendarActivity.getActivityUUID()) {
			calendarActivity.setActivityUUID(uuidv4());
		}

		return this.firebaseActivityService
				   .addActivity(calendarActivity)
				   .then(() => {
					   this.activitiesCountRepository.updateCount(selectedDate, true);
					   this.activitiesRepository.addMonthActivity(calendarActivity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}

	updateActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {

		return this.firebaseActivityService
				   .updateActivity(activity)
				   .then(() => {
					   this.activitiesRepository.updateMonthActivities(activity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}

	deleteActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {

		return this.firebaseActivityService
				   .deleteActivity(activity)
				   .then(() => {
					   this.activitiesCountRepository.updateCount(selectedDate);
					   this.activitiesRepository.deleteActivity(activity);
					   this.selectedDateActivitiesService.selectDayActivities(selectedDate);
				   });
	}
}
