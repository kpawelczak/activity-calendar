import { ActivitiesCountMonth } from './activities-count-month';

export class ActivitiesCount {

	constructor(readonly year: number,
				readonly months: Array<ActivitiesCountMonth>) {
	}

}
