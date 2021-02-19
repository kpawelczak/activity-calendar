import { Activity } from '../../client/templates/activity';

export class WeekdayTemplate {

	constructor(readonly weekday: string,
				readonly templates: Array<Activity> = []) {
	}
}
