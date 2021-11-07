import { Injectable } from '@angular/core';
import { CalendarActivity } from './calendar-activity';
import { ActivitiesRepository } from './activities.repository';
import { ActivitiesStorage } from '../../storage/activities.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { switchMap, take } from 'rxjs/operators';
import { Reactive } from '../../../../common/cdk/reactive';
import { DomainChangesService } from '../../../domain/changes/store/domain-changes.service';
import { DomainChangesType } from '../../../domain/changes/domain-changes.type';
import { of } from 'rxjs';


@Injectable()
export class ActivitiesService extends Reactive {

	constructor(private readonly activitiesRepository: ActivitiesRepository,
				private readonly domainChangesService: DomainChangesService,
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
	}

	private updateLocalMonthActivities(activities: Array<CalendarActivity>): void {
		this.authService
			.onLoggedIn()
			.pipe(
				switchMap((loggedIn: boolean) => {
					this.activitiesStorage.storeMonthActivities(activities, loggedIn);

					return loggedIn
						? this.domainChangesService.registerNewChange(DomainChangesType.ACTIVITIES)
						: of(null);
				}),
				take(1),
				this.takeUntil()
			)
			.subscribe((changesUUID: string) => {
				this.activitiesStorage.updateChangesId(changesUUID);
			});
	}

	private getActivities(): Array<CalendarActivity> {
		return this.activitiesRepository.getValues();
	}
}
