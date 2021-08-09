import { TemplateActivity } from '../template-activity';
import { Weekday } from '../weekday';

export class WeekdayTemplate {

	private templates: Array<TemplateActivity> = [];

	constructor(private readonly weekday: Weekday,
				templates?: Array<TemplateActivity>) {
		if (templates) {
			this.templates = templates;
		}
	}

	getWeekday(): Weekday {
		return this.weekday;
	}

	getTemplateCounter(): number {
		return this.templates?.length;
	}

	getTemplates(): Array<TemplateActivity> {
		return this.templates;
	}

	setTemplates(templates: Array<TemplateActivity>): void {
		this.templates = [...templates];
	}

	addTemplate(template: TemplateActivity): void {
		this.templates.push(template);
	}

	removeTemplate(index: number): void {
		this.templates.splice(index, 1);
	}
}
