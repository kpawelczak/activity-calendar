import { Injectable } from '@angular/core';
import { CalendarActivity } from './calendar-activity';
import { ActivitiesRepository } from './activities.repository';
import { ActivitiesStorage } from '../../storage/activities.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { take } from 'rxjs/operators';
import { Reactive } from '../../../../common/cdk/reactive';

@Injectable()
export class ActivitiesService extends Reactive {

	constructor(private readonly activitiesRepository: ActivitiesRepository,
				private readonly authService: AuthenticationService,
				private readonly activitiesStorage: ActivitiesStorage) {
		super();
	}

	addMonthActivity(activity: CalendarActivity): void {
		const monthActivities = this.getActivities() ? this.getActivities() : [];

		monthActivities.push(activity);

		this.next(monthActivities);
	}

	updateMonthActivities(activity: CalendarActivity): void {
		const updatedActivities = this.getActivities()
									  .map((calendarActivity: CalendarActivity) => {
										  return activity.getActivityUUID() === calendarActivity.getActivityUUID()
											  ? activity
											  : calendarActivity;
									  });
		this.next(updatedActivities);
	}

	deleteActivity(activity: CalendarActivity): void {
		const updatedActivities = this.getActivities()
									  .filter((calendarActivity: CalendarActivity) => {
										  return calendarActivity.getActivityUUID() !== activity.getActivityUUID();
									  });

		this.next(updatedActivities);
	}

	private next(activities: Array<CalendarActivity>): void {
		this.activitiesRepository.next(activities);
		this.updateLocalMonthActivities(activities);

		// TODO CHANGES ID UPDATE
	}

	private updateLocalMonthActivities(activities: Array<CalendarActivity>): void {
		this.authService
			.onLoggedIn()
			.pipe(
				take(1),
				this.takeUntil()
			)
			.subscribe((loggedIn: boolean) => {
				this.activitiesStorage.storeMonthActivities(activities, loggedIn);
			});
	}

	private getActivities(): Array<CalendarActivity> {
		return this.activitiesRepository.getValues();
	}
}
