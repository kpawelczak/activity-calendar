import { Injectable } from '@angular/core';
import { CalendarActivity } from './calendar-activity';
import { FirebaseActivitiesService } from '../../infrastructure/firebase-activities.service';
import { ValuesRepository } from '../../../../common/cdk/values-repository';
import { ActivitiesStorage } from '../../storage/activities.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { map, switchMap, take } from 'rxjs/operators';
import { FirebaseActivitiesChangesService } from '../../infrastructure/firebase-activities-changes.service';
import { Observable, of } from 'rxjs';
import { ActivitiesCount } from '../count/activities-count';

// TODO name ActivitiesByMonth
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
				map((calendarActivities: Array<CalendarActivity>) => {
					return !!calendarActivities?.length ? calendarActivities : [];
				}),
				take(1),
				this.takeUntil())
			.subscribe((calendarActivities: Array<CalendarActivity>) => {
				this.next(calendarActivities);
			});
	}

	private onActivitiesWithLoggedInUser(year: number,
										 month: number): Observable<Array<CalendarActivity>> {
		return this.onActivitiesChanges()
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
						  this.activitiesStorage.storeMonthActivities(calendarActivities, true, { year, month });
						  return calendarActivities;
					  })
				  );
	}

// TODO name
	private onActivitiesChanges(): Observable<boolean> {
		return this.firebaseActivitiesChangesService
				   .onChangesId('activities', 'days')
				   .pipe(
					   map((changesId: string) => {
						   return changesId === this.activitiesStorage.getStoredChangesId();
					   })
				   );
	}
}
