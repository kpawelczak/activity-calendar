import { Injectable } from '@angular/core';
import { CalendarActivity } from './calendar-activity';
import { FirebaseActivitiesService } from '../../infrastructure/firebase-activities.service';
import { ValuesRepository } from '../../../../common/cdk/values-repository';
import { ActivitiesStorage } from '../../storage/activities.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { map, switchMap, take } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { DomainChangesRepository } from '../../../domain/changes/store/domain-changes.repository';
import { DomainChanges } from '../../../domain/changes/domain-changes';

// TODO name ActivitiesByMonth
@Injectable()
export class ActivitiesRepository extends ValuesRepository<Array<CalendarActivity>> {

	constructor(private readonly firebaseActivitiesService: FirebaseActivitiesService,
				private readonly domainChangesRepository: DomainChangesRepository,
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
		return this.onDomainChanges()
				   .pipe(
					   switchMap((checkStorage: boolean) => {
						   return this.onValuesFromStorage(year, month, checkStorage);
					   })
				   );
	}

	private onValuesFromStorage(year: number,
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

	private onDomainChanges(): Observable<boolean> {
		return this.domainChangesRepository
				   .onValues()
				   .pipe(
					   map((domainChanges: DomainChanges) => {
						   return domainChanges.getActivitiesId() === this.activitiesStorage.getStoredChangesId();
					   })
				   );
	}
}
