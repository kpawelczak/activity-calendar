import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CalendarActivity } from '../activities/calendar-activity';
import { FirebaseActivityService } from '../../infrastructure/firebase-activity.service';
import { SelectedActivitiesService } from '../selected-activities/selected-activities.service';
import { ActivitiesService } from '../activities/activities.service';
import { ActivitiesCountService } from '../count/activities-count.service';


@Injectable()
export class SelectedActivityService {

	constructor(private readonly firebaseActivityService: FirebaseActivityService,
				private readonly selectedActivitiesService: SelectedActivitiesService,
				private readonly activitiesCountService: ActivitiesCountService,
				private readonly activitiesService: ActivitiesService) {
	}

	addActivity(selectedDate: Date, calendarActivity: CalendarActivity): Promise<void> {
		if (!calendarActivity.getActivityUUID()) {
			calendarActivity.setActivityUUID(uuidv4());
		}
		return this.firebaseActivityService
				   .addActivity(calendarActivity)
				   .then(() => {
					   this.activitiesCountService.updateCount(selectedDate, true);
					   this.activitiesService.addMonthActivity(calendarActivity);
					   this.selectedActivitiesService.updateActivities(selectedDate);
				   });
	}

	updateActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {
		return this.firebaseActivityService
				   .updateActivity(activity)
				   .then(() => {
					   this.activitiesService.updateMonthActivities(activity);
					   this.selectedActivitiesService.updateActivities(selectedDate);
				   });
	}

	deleteActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {
		return this.firebaseActivityService
				   .deleteActivity(activity)
				   .then(() => {
					   this.activitiesCountService.updateCount(selectedDate);
					   this.activitiesService.deleteActivity(activity);
					   this.selectedActivitiesService.updateActivities(selectedDate);
				   });
	}
}
