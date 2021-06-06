import { TemplateActivity } from '../../template-activity';
import { Weekday } from '../weekday';
import { TemplateCounter } from '../counters/template-counter';

export class WeekdayTemplate {

	private templateCounter: TemplateCounter;

	constructor(readonly weekday: Weekday,
				readonly templates: Array<TemplateActivity> = [],
				templateCounter?: TemplateCounter) {
		if (templateCounter) {
			this.templateCounter = templateCounter;
		}
	}

	getTemplateCounter(): TemplateCounter {
		return this.templateCounter;
	}

	setTemplateCounter(templateCounter: TemplateCounter): void {
		this.templateCounter = templateCounter;
	}

}
