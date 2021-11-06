import { Injectable } from '@angular/core';
import { ActivitiesRepository } from '../activities/activities.repository';
import { SelectedDayTemplateActivityRepository } from '../template/selected-day-template-activity.repository';
import { filter, take } from 'rxjs/operators';
import { CalendarActivity } from '../activities/calendar-activity';
import { DateUtils } from '../../../../common/utils/date-util/date-utils';
import { SelectedActivitiesRepository } from './selected-activities.repository';
import { Reactive } from '../../../../common/cdk/reactive';

@Injectable()
export class SelectedActivitiesService extends Reactive {

	private selectedDay: Date;

	constructor(private readonly activitiesRepository: ActivitiesRepository,
				private readonly selectedActivitiesRepository: SelectedActivitiesRepository,
				private readonly selectedDayTemplateActivityRepository: SelectedDayTemplateActivityRepository) {
		super();
	}

	selectActivities(date: Date): void {
		if (!DateUtils.areDatesSame(this.selectedDay, date)) {
			this.selectedDay = date;
			this.nextActivities(date);
		}
	}

	updateActivities(date: Date): void {
		this.nextActivities(date);
	}

	resetSelectedDay(): void {
		this.selectedDay = null;
	}

	private nextActivities(date: Date): void {
		this.activitiesRepository
			.onValues()
			.pipe(
				filter((activities: Array<CalendarActivity>) => !!activities),
				take(1),
				this.takeUntil()
			)
			.subscribe((activities: Array<CalendarActivity>) => {
				const selectedActivities = this.getSelectedActivities(activities, date);
				this.selectedActivitiesRepository.next(selectedActivities);
				this.nextTemplates(date, selectedActivities);
			});
	}

	private nextTemplates(date: Date, activities: Array<CalendarActivity>): void {
		if (this.isSelectedDayToday(date)) {
			this.selectedDayTemplateActivityRepository.next(activities);
		}
	}

	private getSelectedActivities(activities: Array<CalendarActivity>, date: Date): Array<CalendarActivity> {
		return activities?.filter((calendarActivity: CalendarActivity) => {
			return calendarActivity.day === date.getTime();
		});
	}

	private isSelectedDayToday(date: Date): boolean {
		return DateUtils.areDatesSame(date, new Date());
	}
}
