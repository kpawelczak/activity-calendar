import { Injectable } from '@angular/core';
import { StorageArchive } from '../../../common/cdk/storage-archive';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { LocalActivities } from './local-activities';
import { LocalActivityByMonth } from './local-activity-by-month';
import { ActivitiesConverter } from './activities.converter';
import { ActivitiesCount } from '../store/count/activities-count';
import { LocalActivitiesCount } from './local-activities-count';


@Injectable()
export class ActivitiesStorage extends StorageArchive<LocalActivities> {

	private static readonly LOCAL = 'LOCAL';

	private static readonly USER = 'USER';

	constructor(private readonly activitiesConverter: ActivitiesConverter) {
		super();
	}

	getStorageKey(): string {
		return 'ac-activities';
	}

	getStoredChangesId(): string {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(true))?.changesId
			? this.getStoredValue(this.getActivitiesExtendedKey(true)).changesId
			: '-1';
	}

	getStoredActivitiesCount(loggedIn: boolean): Array<ActivitiesCount> | null {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.count
			? this.transformActivitiesCount(this.getStoredValue(this.getActivitiesExtendedKey(loggedIn)).count)
			: null;
	}

	getLocalMonthActivities(year: number, month: number, loggedIn: boolean): Array<CalendarActivity> {
		return !!this.getLocalActivities(year, month, loggedIn)?.calendarActivities.length
			? this.transformActivities(this.getLocalActivities(year, month, loggedIn))
			: [];
	}

	// TODO Cleanup
	storeMonthActivities(calendarActivities: Array<CalendarActivity>,
						 loggedIn: boolean,
						 options?: {
							 year: number,
							 month: number
						 }
	) {
		const key = this.getActivitiesExtendedKey(loggedIn),
			month = this.getLocalMonthKey(options);

		// TODO name
		const newValue: LocalActivityByMonth = {
			month,
			calendarActivities: calendarActivities as any
		};

		const localActivities: LocalActivities = {
			activitiesByMonths: [newValue as any]
		};

		let storedActivities
			= this.getStoredValue(key)?.activitiesByMonths
			? this.getStoredValue(key)
			: {
				...this.getStoredValue(key),
				...localActivities
			}; // ?

		const isMonth
			= storedActivities
			.activitiesByMonths
			.find((localActivityByMonth: LocalActivityByMonth) => localActivityByMonth.month === month);

		if (isMonth) {
			storedActivities = {
				...storedActivities,
				activitiesByMonths: storedActivities.activitiesByMonths.map((localActivityByMonth: LocalActivityByMonth) => {
					const shouldReplace = localActivityByMonth.month === month;

					return shouldReplace
						? {
							month,
							calendarActivities: calendarActivities as any
						}
						: localActivityByMonth;
				})
			};
		} else {
			storedActivities.activitiesByMonths.push(newValue);
		}

		this.store(storedActivities, key);
	}

	storeActivitiesCount(activitiesCount: Array<ActivitiesCount>, loggedIn: boolean): void {
		const key = this.getActivitiesExtendedKey(loggedIn),
			newStoredActivitiesCount = {
				...this.getStoredValue(key),
				count: activitiesCount as any
			}; // ?

		this.store(newStoredActivitiesCount, key);
	}

	getLocalActivities(year: number, month: number, loggedIn: boolean): LocalActivityByMonth | null {
		const monthActivities = this.getActivities(loggedIn)?.find((localActivity: LocalActivityByMonth) => {
			return localActivity.month === this.getLocalMonthKey({ year, month });
		});

		return !!monthActivities ? monthActivities : null;
	}

	updateChangesId(changesId: string): void {
		const key = this.getActivitiesExtendedKey(true),
			storedActivities = this.getStoredValue(key),
			newStoredActivities = { ...storedActivities, changesId };
		this.store(newStoredActivities, key);
	}

	private transformActivities(localActivities: LocalActivityByMonth): Array<CalendarActivity> {
		return this.activitiesConverter.convertToActivities(localActivities.calendarActivities);
	}

	private transformActivitiesCount(localActivitiesCount: Array<LocalActivitiesCount>): Array<ActivitiesCount> {
		return this.activitiesConverter.convertToActivitiesCount(localActivitiesCount);
	}

	private getActivities(loggedIn: boolean): Array<LocalActivityByMonth> {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.activitiesByMonths
			? this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.activitiesByMonths
			: [];
	}

	private getActivitiesExtendedKey(loggedIn: boolean): string {
		return loggedIn ? ActivitiesStorage.USER : ActivitiesStorage.LOCAL;
	}

	private getLocalMonthKey(options?: { year: number, month: number }): string {
		const year = options?.year ? options.year : new Date().getFullYear(),
			month = options?.month ? options.month : new Date().getMonth();

		return `${year}-${month}`;
	}
}
