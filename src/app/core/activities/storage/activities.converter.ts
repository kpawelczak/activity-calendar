import { Injectable } from '@angular/core';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { QuantifiedActivity } from '../../../common/ui/quantified-activity/quantified-activity';
import { LocalActivity } from './local-activity';
import { ActivitiesCount } from '../store/count/activities-count';
import { LocalActivitiesCount, LocalActivitiesCountByMonth } from './local-activities-count';
import { ActivitiesCountMonth } from '../store/count/activities-count-month';


@Injectable()
export class ActivitiesConverter {

	convertToActivities(localActivities: Array<LocalActivity>): Array<CalendarActivity> {
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

	convertToActivitiesCount(localActivitiesCount: Array<LocalActivitiesCount>): Array<ActivitiesCount> {
		return localActivitiesCount.map((_localActivitiesCount: LocalActivitiesCount) => {
			const activitiesByMonths = _localActivitiesCount.months
														   .map((localActivitiesCountByMonth: LocalActivitiesCountByMonth) => {
															   return new ActivitiesCountMonth(localActivitiesCountByMonth.month, localActivitiesCountByMonth?.count);
														   });
			return new ActivitiesCount(_localActivitiesCount.year, activitiesByMonths);
		});
	}

	private parseQuantifiedActivities(quantifiedActivities: Array<QuantifiedActivity>): Array<QuantifiedActivity> {
		return quantifiedActivities?.length
			? quantifiedActivities.map((quantifiedActivity: QuantifiedActivity) => new QuantifiedActivity(quantifiedActivity.value, quantifiedActivity.unit))
			: [];
	}
}
