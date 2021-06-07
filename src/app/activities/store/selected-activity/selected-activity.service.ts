import { Injectable } from '@angular/core';
import { ActivitiesRepository } from '../activities/activities.repository';
import { v4 as uuidv4 } from 'uuid';
import { CalendarActivity } from '../../../common/models/calendar-activity';
import { FirebaseActivityService } from '../../infrastructure/firebase-activity.service';
import { ActivitiesCountRepository } from '../count/activities-count.repository';
import { SelectedActivitiesService } from '../selected-activities/selected-activities.service';


@Injectable()
export class SelectedActivityService {

	constructor(private readonly firebaseActivityService: FirebaseActivityService,
				private readonly selectedActivitiesService: SelectedActivitiesService,
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
					   this.selectedActivitiesService.updateActivities(selectedDate);
				   });
	}

	updateActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {
		return this.firebaseActivityService
				   .updateActivity(activity)
				   .then(() => {
					   this.activitiesRepository.updateMonthActivities(activity);
					   this.selectedActivitiesService.updateActivities(selectedDate);
				   });
	}

	deleteActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {
		return this.firebaseActivityService
				   .deleteActivity(activity)
				   .then(() => {
					   this.activitiesCountRepository.updateCount(selectedDate);
					   this.activitiesRepository.deleteActivity(activity);
					   this.selectedActivitiesService.updateActivities(selectedDate);
				   });
	}
}
