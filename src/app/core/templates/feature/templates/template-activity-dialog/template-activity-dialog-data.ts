import { TemplateActivity } from '../../../template-activity';
import { WeekdayTemplate } from '../../../store/weekday-template';

export interface TemplateActivityDialogData {
	weekdayTemplate: WeekdayTemplate;
	templateActivity?: TemplateActivity;
}
