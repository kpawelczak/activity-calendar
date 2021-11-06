import { Injectable } from '@angular/core';
import { StorageArchive } from '../../../common/cdk/storage-archive';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { LocalActivities } from './local-activities';
import { LocalActivityByMonth } from './local-activity-by-month';
import { ActivitiesConverter } from './activities.converter';


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

	getLocalMonthActivities(year: number, month: number, loggedIn: boolean): Array<CalendarActivity> {
		return !!this.getLocalActivities(year, month, loggedIn)?.calendarActivities.length
			? this.transformActivities(this.getLocalActivities(year, month, loggedIn))
			: [];
	}

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
		const newValue = {
			month,
			calendarActivities
		};

		const localActivities: LocalActivities = {
			activitiesByMonths: [newValue as any]
		};

		let storedActivities = this.getStoredValue(key)?.activitiesByMonths ? this.getStoredValue(key) : localActivities;

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
		this.store(storedActivities, key);
	}

	getLocalActivities(year: number, month: number, loggedIn: boolean): LocalActivityByMonth | null {
		const monthActivities = this.getActivities(loggedIn)?.find((localActivity: LocalActivityByMonth) => {
			return localActivity.month === this.getLocalMonthKey({ year, month });
		});

		return !!monthActivities
			? monthActivities
			: null;
	}

	private transformActivities(localActivities: LocalActivityByMonth): Array<CalendarActivity> {
		return this.activitiesConverter.convert(localActivities.calendarActivities);
	}

	private getActivities(loggedIn: boolean): Array<LocalActivityByMonth> {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.activitiesByMonths
			? this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.activitiesByMonths
			: [];
	}

	private getActivitiesExtendedKey(loggedIn: boolean): string {
		return loggedIn ? ActivitiesStorage.USER : ActivitiesStorage.LOCAL;
	}

	// separate file
	private getLocalMonthKey(options?: { year: number, month: number }): string {
		const year = options?.year ? options.year : new Date().getFullYear(),
			month = options?.month ? options.month : new Date().getMonth();

		return `${year}-${month}`;
	}
}
