import { TemplateActivity } from './template-activity';

export class WeekdayTemplate {

	constructor(readonly weekday: string,
				readonly templates: Array<TemplateActivity> = []) {
	}
}
