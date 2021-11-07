import { Injectable } from '@angular/core';
import { ActivityConfig } from '../store/activity-config';
import { LocalActivityConfig } from './local-activities-config';

@Injectable()
export class ActivitiesConfigConverter {

	convertDefinedActivities(localActivityConfigs: Array<LocalActivityConfig>): Array<ActivityConfig> {
		return localActivityConfigs.map((localActivityConfig: LocalActivityConfig) => {
			return new ActivityConfig(localActivityConfig.name, localActivityConfig.entries, localActivityConfig?.uuid);
		});
	}

}
