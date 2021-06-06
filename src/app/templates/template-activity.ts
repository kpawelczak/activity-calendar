import { Weekday } from './weekday';

export class TemplateActivity {

	constructor(readonly weekday: Weekday,
				readonly name: string,
				readonly amount: string,
				readonly templateUUID: string,
				readonly templateSetName?: string) {
	}
}
