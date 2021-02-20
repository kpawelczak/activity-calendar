import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarActivity } from '../../../../firebase/activities/month-activities/calendar-activity';
import { SelectedDayActivitiesRepository } from '../activities/selected-day-activities.repository';
import { map } from 'rxjs/operators';

@Injectable()
export class SelectedDayTemplateActivityRepository {


	constructor(private readonly selectedDayActivitiesRepository: SelectedDayActivitiesRepository) {

	}

	onActivity(templateUUID: string): Observable<CalendarActivity> {
		return this.selectedDayActivitiesRepository
				   .onActivities()
				   .pipe(
					   map((activities: Array<CalendarActivity>) => {
						   const activityWithAssignedTemplate = this.getActivityWithAssignedTemplate(activities, templateUUID);
						   return activityWithAssignedTemplate ? activityWithAssignedTemplate : null;
					   })
				   );
	}

	private getActivityWithAssignedTemplate(activities: Array<CalendarActivity>,
											templateUUID: string): CalendarActivity {
		return activities.find((activity: CalendarActivity) => activity.getAssignedTemplateUUID() === templateUUID);
	}
}
