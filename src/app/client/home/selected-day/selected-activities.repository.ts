import { Injectable } from '@angular/core';
import { ValuesRepository } from '../../../common/cdk/values-repository';
import { CalendarActivity } from '../../../common/models/calendar-activity';
import { filter, switchMap } from 'rxjs/operators';
import { ActivitiesRepository } from '../../../services/repositories/activities/activities.repository';
import { SelectedActivitiesDateService } from './selected-activities-date.service';
import { combineLatest, of } from 'rxjs';
import { SelectedDayTemplateActivityRepository } from './template/selected-day-template-activity.repository';
import { DateUtils } from '../../../common/utils/date-util/date-utils';

@Injectable()
export class SelectedActivitiesRepository extends ValuesRepository<Array<CalendarActivity>> {

	constructor(private readonly activitiesRepository: ActivitiesRepository,
				private readonly selectedActivitiesDateService: SelectedActivitiesDateService,
				private readonly selectedDayTemplateActivityRepository: SelectedDayTemplateActivityRepository) {
		super();
	}

	onActivities() {
		return combineLatest(
			[
				this.activitiesRepository.onValues(),
				this.selectedActivitiesDateService.onValues()
			])
			.pipe(
				// filter(([activities, date]: [Array<CalendarActivity>, Date]) => this.isSelectedDayInActivities(activities, date)),
				switchMap(([activities, date]: [Array<CalendarActivity>, Date]) => {
					let newActivities;

					if (this.isSelectedDayToday(date)) {
						this.selectedDayTemplateActivityRepository.next(activities);
					}

					if (this.isSelectedDayInActivities(activities, date)) {
						newActivities = this.getSelectedDayActivities(activities, date);
						this.next(newActivities);
					}

					return of(newActivities);
				}),
				filter((activities: Array<CalendarActivity>) => activities?.length > 0)
			);
	}

	private isSelectedDayInActivities(activities: Array<CalendarActivity>, date): boolean {
		const firstActivityDate = activities[0].day,
			lastActivityDate = activities[activities.length - 1].day,
			selectedDateTime = date.getTime();
		return selectedDateTime >= firstActivityDate && selectedDateTime <= lastActivityDate;
	}

	private getSelectedDayActivities(activities, date): Array<CalendarActivity> {
		return activities?.filter((calendarActivity: CalendarActivity) => {
			return calendarActivity.day === date.getTime();
		});
	}

	private isSelectedDayToday(date: Date): boolean {
		return DateUtils.areDatesSame(date, new Date());
	}
}
