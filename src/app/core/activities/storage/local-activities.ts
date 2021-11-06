import { LocalActivityByMonth } from './local-activity-by-month';

export interface LocalActivities {
	changesId?: string;
	activitiesByMonths?: Array<LocalActivityByMonth>;
	count?: any;
}
