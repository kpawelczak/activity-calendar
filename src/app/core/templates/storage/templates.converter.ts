import { Injectable } from '@angular/core';
import { LocalQuantifiedActivity, LocalTemplateActivity, LocalWeekdayTemplate } from './local-templates';
import { WeekdayTemplate } from '../store/weekday-template';
import { TemplateActivity } from '../template-activity';
import { QuantifiedActivity } from '../../../common/ui/quantified-activity/quantified-activity';

@Injectable()
export class TemplatesConverter {

	convertTemplates(templates: Array<LocalWeekdayTemplate>): Array<WeekdayTemplate> {
		return templates.map((localWeekdayTemplate: LocalWeekdayTemplate) => {

			return new WeekdayTemplate(localWeekdayTemplate.weekday, this.getTemplates(localWeekdayTemplate));
		});
	}

	private getTemplates(localWeekdayTemplate: LocalWeekdayTemplate) {
		return !!localWeekdayTemplate?.templates.length
			? localWeekdayTemplate?.templates.map((localTemplateActivity: LocalTemplateActivity) => {
				const quantifiedActivities = localTemplateActivity.quantifiedActivities
																  .map((localQuantifiedActivity: LocalQuantifiedActivity) => {
																	  return new QuantifiedActivity(
																		  localQuantifiedActivity.value,
																		  localQuantifiedActivity.unit);
																  });

				return new TemplateActivity(
					localTemplateActivity.weekday,
					localTemplateActivity.name,
					quantifiedActivities,
					localTemplateActivity.templateUUID,
					localTemplateActivity?.templateSetName);
			})
			: [];
	}
}
