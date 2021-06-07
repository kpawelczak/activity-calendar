import { Injectable } from '@angular/core';
import { CalendarActivity } from './calendar-activity';
import { FirebaseActivitiesService } from '../../infrastructure/firebase-activities.service';
import { ValuesRepository } from '../../../common/cdk/values-repository';

@Injectable()
export class ActivitiesRepository extends ValuesRepository<Array<CalendarActivity>> {

	constructor(private readonly firebaseActivitiesService: FirebaseActivitiesService) {
		super();
	}

	loadActivities(year: number, month: number): void {
		this.firebaseActivitiesService
			.getMonthActivities(year, month)
			.subscribe((calendarActivities: Array<CalendarActivity>) => {
				this.next(calendarActivities);
			});
	}

	addMonthActivity(activity: CalendarActivity): void {
		const monthActivities = this.getValues() ? this.getValues() : [];

		monthActivities.push(activity);

		this.next(monthActivities);
	}

	updateMonthActivities(activity: CalendarActivity): void {
		const updatedActivities = this.getValues()
									  .map((calendarActivity: CalendarActivity) => {
										  return activity.getActivityUUID() === calendarActivity.getActivityUUID()
											  ? activity
											  : calendarActivity;
									  });

		this.next(updatedActivities);
	}

	deleteActivity(activity: CalendarActivity): void {
		const updatedActivities = this.getValues()
									  .filter((calendarActivity: CalendarActivity) => {
										  return calendarActivity.getActivityUUID() !== activity.getActivityUUID();
									  });

		this.next(updatedActivities);
	}

}
