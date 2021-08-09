import { ActivityDimensioned } from '../../store/activities/activity-dimensioned';

export interface ActivityFormEntry {
	name: string;
	entries: Array<ActivityDimensioned>;
}
