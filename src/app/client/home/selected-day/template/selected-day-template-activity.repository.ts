import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CalendarActivity } from '../../../../common/models/calendar-activity';

@Injectable()
export class SelectedDayTemplateActivityRepository {

	private readonly activities$ = new ReplaySubject<Array<CalendarActivity>>(1);

	onActivity(templateUUID: string): Observable<CalendarActivity> {
		return this.activities$
				   .asObservable()
				   .pipe(
					   map((activities: Array<CalendarActivity>) => {
						   const activityWithAssignedTemplate = this.getActivityWithAssignedTemplate(activities, templateUUID);
						   return activityWithAssignedTemplate ? activityWithAssignedTemplate : null;
					   })
				   );
	}

	next(activities: Array<CalendarActivity>): void {
		this.activities$.next(activities);
	}

	private getActivityWithAssignedTemplate(activities: Array<CalendarActivity>,
											templateUUID: string): CalendarActivity {
		return activities?.find((activity: CalendarActivity) => activity.getAssignedTemplateUUID() === templateUUID);
	}
}
