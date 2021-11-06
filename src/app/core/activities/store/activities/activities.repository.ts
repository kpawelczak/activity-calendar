import { Injectable } from '@angular/core';
import { CalendarActivity } from './calendar-activity';
import { FirebaseActivitiesService } from '../../infrastructure/firebase-activities.service';
import { ValuesRepository } from '../../../../common/cdk/values-repository';
import { ActivitiesStorage } from '../../storage/activities.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { map, switchMap, take } from 'rxjs/operators';
import { FirebaseActivitiesChangesService } from '../../infrastructure/firebase-activities-changes.service';
import { Observable, of } from 'rxjs';


@Injectable()
export class ActivitiesRepository extends ValuesRepository<Array<CalendarActivity>> {

	constructor(private readonly firebaseActivitiesService: FirebaseActivitiesService,
				private readonly firebaseActivitiesChangesService: FirebaseActivitiesChangesService,
				private readonly authService: AuthenticationService,
				private readonly activitiesStorage: ActivitiesStorage) {
		super();
	}

	loadActivities(year: number, month: number): void {
		this.authService
			.onLoggedIn()
			.pipe(
				switchMap((loggedIn: boolean) => {
					const storedMonthActivities = this.activitiesStorage.getLocalMonthActivities(year, month, loggedIn);
					return loggedIn
						? this.onActivitiesWithLoggedInUser(year, month)
						: of(storedMonthActivities);
				}),
				take(1),
				this.takeUntil())
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

	private onActivitiesWithLoggedInUser(year: number,
										 month: number): Observable<any> {
		// 1# is Current Month && check storage
		// 2# check storage first

		return this.onActivitiesChanges(year, month)
				   .pipe(
					   switchMap((checkStorage: boolean) => {
						   return this.onActivitiesFromStorage(year, month, checkStorage);
					   })
				   );
	}

// TODO name
	private onActivitiesFromStorage(year: number,
									month: number,
									checkStorage: boolean): Observable<Array<CalendarActivity>> {

		const storedMonthActivities = this.activitiesStorage.getLocalActivities(year, month, true);
		return checkStorage && !!storedMonthActivities && storedMonthActivities.month
			? of(this.activitiesStorage.getLocalMonthActivities(year, month, true))
			: this.firebaseActivitiesService
				  .getMonthActivities(year, month)
				  .pipe(
					  map((calendarActivities: Array<CalendarActivity>) => {
						  console.log('from firebase');
						  // ?
						  this.activitiesStorage.storeActivities(year, month, calendarActivities, true);
						  return calendarActivities;
					  })
				  );
	}

// TODO name
	private onActivitiesChanges(year: number,
								month: number): Observable<boolean> {
		return this.firebaseActivitiesChangesService
				   .onChangesId('activities', 'days')
				   .pipe(
					   map((changesId: string) => {
						   return changesId === this.activitiesStorage.getStoredChangesId(year, month);
					   })
				   );

	}

	// private isInCurrentMonth(year: number, month: number): boolean {
	// 	const today = new Date();
	// 	return today.getMonth() === month &&
	// 		today.getFullYear() === year;
	// }
}
