import { TemplateActivity } from '../template-activity';
import { Weekday } from '../weekday';

export class WeekdayTemplate {

	constructor(readonly weekday: Weekday,
				readonly templates: Array<TemplateActivity> = []) {
	}

	getTemplateCounter(): number {
		return this.templates?.length;
	}

}
