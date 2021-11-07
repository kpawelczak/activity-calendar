import { Injectable } from '@angular/core';
import { ActivitiesCount } from './activities-count';
import { ActivitiesCountMonth } from './activities-count-month';
import { FirebaseActivitiesCountService } from '../../infrastructure/firebase-activities-count.service';
import { SmartRepository } from '../../../../common/cdk/smart-repository';
import { Observable } from 'rxjs';

@Injectable()
export class ActivitiesCountRepository extends SmartRepository<Array<ActivitiesCount>> {

	constructor(private readonly firebaseActivitiesCountService: FirebaseActivitiesCountService) {
		super();
	}

	getValuesFromApi(): Observable<Array<ActivitiesCount>> {
		return this.firebaseActivitiesCountService.getActivitiesCount();
	}

	updateCount(day: Date, increment?: boolean): void {
		let activitiesCount = this.getValues();

		if (!activitiesCount) {
			activitiesCount = [];
		}

		const year = day.getFullYear(),
			month = day.getMonth();

		let activitiesCountUpdatedMonth: ActivitiesCountMonth;

		let updatedMonths;

		let activitiesCountByYear: ActivitiesCount = activitiesCount
														 .find((_activitiesCount: ActivitiesCount) => {
															 return _activitiesCount.year === year;
														 });

		if (!activitiesCountByYear) {
			updatedMonths = [new ActivitiesCountMonth(month, 1)];

			activitiesCountByYear = new ActivitiesCount(year, updatedMonths);

			activitiesCount.push(activitiesCountByYear);
		} else {

			activitiesCountUpdatedMonth = activitiesCountByYear
				.months
				.find((activitiesCountMonth: ActivitiesCountMonth) => {
					return activitiesCountMonth.month === month;
				});

			if (!activitiesCountUpdatedMonth) {
				activitiesCountUpdatedMonth = new ActivitiesCountMonth(month, 0);
				activitiesCountByYear.months.push(activitiesCountUpdatedMonth);
			}

			if (increment) {
				activitiesCountUpdatedMonth.incrementCount();
			} else {
				activitiesCountUpdatedMonth.decrementCount();
			}

			updatedMonths = activitiesCountByYear
				.months
				.map((activitiesCountMonth: ActivitiesCountMonth) => {
					return new ActivitiesCountMonth(activitiesCountMonth.month, activitiesCountMonth.getCount());
				});
			activitiesCountByYear = new ActivitiesCount(year, updatedMonths);
		}

		this.firebaseActivitiesCountService.updateActivitiesCount(activitiesCountByYear);

		this.next(activitiesCount);
	}
}
