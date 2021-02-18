import { RouteNames } from '../../route-names';

export class ActivityCalendarLink {
	constructor(readonly name: string,
				readonly route: RouteNames,
				readonly icon: string) {
	}
}
