import { LocalActivityByMonth } from './local-activity-by-month';

export interface LocalActivities {
	changesId?: string;
	activities?: Array<LocalActivityByMonth>;
	count?: any;
}
