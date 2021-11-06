import { Injectable } from '@angular/core';
import { StorageArchive } from '../../../common/cdk/storage-archive';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { LocalActivities } from './local-activities';
import { LocalActivity } from './local-activity';
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

	getStoredChangesId(year: number, month: number): string {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(true))?.changesId
			? this.getStoredValue(this.getActivitiesExtendedKey(true)).changesId
			: '-1';
	}

	getLocalMonthActivities(year: number, month: number, loggedIn: boolean): Array<CalendarActivity> {
		return !!this.getLocalActivities(year, month, loggedIn)?.calendarActivities.length
			? this.transformActivities(this.getLocalActivities(year, month, loggedIn))
			: [];
	}

	storeActivities(year: number,
					month: number,
					calendarActivities: Array<CalendarActivity>,
					loggedIn?: boolean
	) {
		const key = this.getActivitiesExtendedKey(loggedIn);

		// TODO name
		const newValue = {
			month: `${year}-${month}`,
			calendarActivities
		};

		const localActivities: LocalActivities = {
			activities: [newValue]
		};

		const storedActivities = this.getStoredValue(key)?.activities ? this.getStoredValue(key) : localActivities;

		storedActivities.activities.push(newValue);

		this.store(storedActivities, key);
	}

	getLocalActivities(year: number, month: number, loggedIn: boolean): LocalActivityByMonth | null {
		const monthActivities = this.getActivities(loggedIn)?.find((localActivity: LocalActivityByMonth) => {
			return localActivity.month === `${year}-${month}`;
		});

		return !!monthActivities
			? monthActivities
			: null;
	}

	private transformActivities(localActivities: LocalActivityByMonth): Array<CalendarActivity> {
		return this.activitiesConverter.convert(localActivities.calendarActivities);
	}

	private getActivities(loggedIn: boolean): Array<LocalActivityByMonth> {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.activities
			? this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.activities
			: [];
	}

	private getActivitiesExtendedKey(loggedIn: boolean): string {
		return loggedIn ? ActivitiesStorage.USER : ActivitiesStorage.LOCAL;
	}
}
