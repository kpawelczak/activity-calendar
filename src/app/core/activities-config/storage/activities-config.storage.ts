import { Injectable } from '@angular/core';
import { StorageArchive } from '../../../common/cdk/storage-archive';
import { LocalActivityConfig, LocalActivityConfigs } from './local-activities-config';
import { ActivitiesConfigConverter } from './activities-config.converter';
import { ActivityConfig } from '../store/activity-config';


@Injectable()
export class ActivitiesConfigStorage extends StorageArchive<LocalActivityConfigs> {

	private static readonly LOCAL = 'LOCAL';

	private static readonly USER = 'USER';

	constructor(private readonly activitiesConfigConverter: ActivitiesConfigConverter) {
		super();
	}

	getStorageKey(): string {
		return 'ac-config';
	}

	getStoredChangesId(): string {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(true))?.changesId
			? this.getStoredValue(this.getActivitiesExtendedKey(true)).changesId
			: '-1';
	}

	getStoredUnits(loggedIn: boolean): Array<string> | null {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.units
			? this.getStoredValue(this.getActivitiesExtendedKey(loggedIn)).units
			: null;
	}

	getStoredDefinedActivities(loggedIn: boolean): Array<ActivityConfig> {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.definedActivities
			? this.transformDefinedActivities(this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.definedActivities)
			: [];
	}

	storeDefinedActivities(activityConfigs: Array<ActivityConfig>, loggedIn: boolean): void {
		const key = this.getActivitiesExtendedKey(loggedIn),
			newStoredValues: LocalActivityConfigs = {
				...this.getStoredValue(key),
				definedActivities: activityConfigs as any
			};
		this.store(newStoredValues, key);
	}

	storeUnits(units: Array<string>, loggedIn: boolean): void {
		const key = this.getActivitiesExtendedKey(loggedIn),
			newStoredValues: LocalActivityConfigs = {
				...this.getStoredValue(key),
				units: units
			};
		this.store(newStoredValues, key);
	}

	updateChangesId(changesId: string): void {
		const key = this.getActivitiesExtendedKey(true),
			newStoredValues = { ...this.getStoredValue(key), changesId };
		this.store(newStoredValues, key);
	}

	private getActivitiesExtendedKey(loggedIn: boolean): string {
		return loggedIn ? ActivitiesConfigStorage.USER : ActivitiesConfigStorage.LOCAL;
	}

	private transformDefinedActivities(localActivityConfigs: Array<LocalActivityConfig>): Array<ActivityConfig> {
		return this.activitiesConfigConverter.convertDefinedActivities(localActivityConfigs);
	}
}
