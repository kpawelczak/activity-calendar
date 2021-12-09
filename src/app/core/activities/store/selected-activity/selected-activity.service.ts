import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { CalendarActivity } from '../activities/calendar-activity';
import { FirebaseActivityService } from '../../infrastructure/firebase-activity.service';
import { SelectedActivitiesService } from '../selected-activities/selected-activities.service';
import { ActivitiesService } from '../activities/activities.service';
import { ActivitiesCountService } from '../count/activities-count.service';
import { QuantifiedActivity } from '../../../../common/ui/quantified-activity/quantified-activity';
import { QuantifiedActivityFormEntry } from '../../feature/activity-dialog/activity-form-entry';

interface SelectedActivity {
	selectedDate: Date;
	name: string;
	entries: Array<QuantifiedActivityFormEntry>;
	activityUUID?: string;
	selectedActivityDay?: number;
	templateUUID?: string;
}

@Injectable()
export class SelectedActivityService {

	constructor(private readonly firebaseActivityService: FirebaseActivityService,
				private readonly selectedActivitiesService: SelectedActivitiesService,
				private readonly activitiesCountService: ActivitiesCountService,
				private readonly activitiesService: ActivitiesService) {
	}

	addActivity(newActivity: SelectedActivity): Promise<void> {
		const selectedDate = newActivity.selectedDate,
			calendarActivity = this.createCalendarActivity(newActivity);

		return this.firebaseActivityService
				   .addActivity(calendarActivity)
				   .then(() => {
					   this.activitiesCountService.updateCount(selectedDate, true);
					   this.activitiesService.addMonthActivity(calendarActivity);
					   this.selectedActivitiesService.updateActivities(selectedDate);
				   });
	}

	updateActivity(modifiedActivity: SelectedActivity): Promise<void> {
		const selectedDate = modifiedActivity.selectedDate,
			calendarActivity = this.createCalendarActivity(modifiedActivity);

		return this.firebaseActivityService
				   .updateActivity(calendarActivity)
				   .then(() => {
					   this.activitiesService.updateMonthActivities(calendarActivity);
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

	private createCalendarActivity(activity: SelectedActivity): CalendarActivity {
		const assignedTemplateUUID = !!activity.templateUUID ? activity.templateUUID : '',
			activityUUID = !!activity.activityUUID ? activity.activityUUID : uuidv4(),
			quantifiedActivities
				= activity.entries
						  .map((quantifiedActivityFormEntry: QuantifiedActivityFormEntry) => {
							  return new QuantifiedActivity(
								  quantifiedActivityFormEntry.value,
								  quantifiedActivityFormEntry.unit
							  );
						  });

		return new CalendarActivity(
			activity.selectedDate.getTime(),
			activity.name,
			quantifiedActivities,
			{
				activityUUID,
				assignedTemplateUUID
			});
	}
}
