import { RouteName } from '../../route-name';

export class ActivityCalendarLink {
	constructor(readonly name: string,
				readonly route: RouteName,
				readonly icon: string) {
	}
}
