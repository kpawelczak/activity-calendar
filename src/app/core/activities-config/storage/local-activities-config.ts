import { ActivityEntry } from '../store/activity-entry';

export interface LocalActivityConfig {
	name: string;
	entries: Array<ActivityEntry>;
	uuid?: string;
}

export interface LocalActivityConfigs {
	changesId?: string;
	definedActivities?: Array<LocalActivityConfig>;
	units?: Array<string>;
}
