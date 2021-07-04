import { ActivityEntry } from './activity-entry';

export class ActivityConfig {

	constructor(readonly name: string,
				readonly entries: Array<ActivityEntry>) {
	}
}
