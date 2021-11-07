import { LocalActivityByMonth } from './local-activity-by-month';
import { LocalActivitiesCount } from './local-activities-count';

export interface LocalActivities {
	changesId?: string;
	activitiesByMonths?: Array<LocalActivityByMonth>;
	count?: Array<LocalActivitiesCount>;
}
