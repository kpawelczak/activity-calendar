import { Weekday } from './weekday';
import { QuantifiedActivity } from '../../common/ui/quantified-activity/quantified-activity';

export class TemplateActivity {

	constructor(readonly weekday: Weekday,
				readonly name: string,
				readonly quantifiedActivity: Array<QuantifiedActivity>,
				readonly templateUUID: string,
				readonly templateSetName?: string) {
	}
}
