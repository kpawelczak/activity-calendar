import { Injectable } from '@angular/core';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { QuantifiedActivity } from '../../../common/ui/quantified-activity/quantified-activity';
import { LocalActivity } from './local-activity';


@Injectable()
export class ActivitiesConverter {

	convert(localActivities: Array<LocalActivity>): Array<CalendarActivity> {
		return localActivities.map((localActivity: LocalActivity) => {
			return new CalendarActivity(
				localActivity.day,
				localActivity.name,
				this.parseQuantifiedActivities(localActivity.quantifiedActivities),
				{
					activityUUID: localActivity?.activityUUID,
					assignedTemplateUUID: localActivity?.assignedTemplateUUID
				}
			);
		});
	}

	convertToLocalActivities() {
		// TBD
	}

	private parseQuantifiedActivities(quantifiedActivities: Array<QuantifiedActivity>): Array<QuantifiedActivity> {
		return quantifiedActivities?.length
			? quantifiedActivities.map((quantifiedActivity: QuantifiedActivity) => new QuantifiedActivity(quantifiedActivity.value, quantifiedActivity.unit))
			: [];
	}
}
