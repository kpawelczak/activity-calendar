import { Weekday } from './weekday';
import { ActivityDimensioned } from '../activities/store/activities/activity-dimensioned';

export class TemplateActivity {

	constructor(readonly weekday: Weekday,
				readonly name: string,
				readonly dimensionedActivities: Array<ActivityDimensioned>,
				readonly templateUUID: string,
				readonly templateSetName?: string) {
	}

}
