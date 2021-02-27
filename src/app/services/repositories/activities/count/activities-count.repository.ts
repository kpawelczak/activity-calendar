import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ActivitiesCount } from '../../../../common/models/activities-count';
import { ActivitiesCountMonth } from '../../../../common/models/activities-count-month';
import { FirebaseActivitiesCountService } from '../../../firebase/activities/activities-count/firebase-activities-count.service';

@Injectable()
export class ActivitiesCountRepository {

	private activitiesCount: Array<ActivitiesCount> = null;

	private readonly activitiesCount$ = new BehaviorSubject<Array<ActivitiesCount>>(this.activitiesCount);

	constructor(private readonly firebaseActivitiesCountService: FirebaseActivitiesCountService) {
	}

	onActivitiesCount(): Observable<Array<ActivitiesCount>> {
		return this.activitiesCount$.asObservable();
	}

	next(activitiesCount: Array<ActivitiesCount>): void {
		this.activitiesCount = activitiesCount;
		this.activitiesCount$.next(activitiesCount);
	}

	updateCount(day: Date, increment?: boolean): void {

		if (!this.activitiesCount) {
			this.activitiesCount = [];
		}

		const year = day.getFullYear(),
			month = day.getMonth();

		let activitiesCountUpdatedMonth: ActivitiesCountMonth;

		let updatedMonths;

		let activitiesCountByYear: ActivitiesCount = this.activitiesCount
														 .find((activitiesCount: ActivitiesCount) => {
															 return activitiesCount.year === year;
														 });

		if (!activitiesCountByYear) {
			updatedMonths = [new ActivitiesCountMonth(month, 1)];

			activitiesCountByYear = new ActivitiesCount(year, updatedMonths);

			this.activitiesCount.push(activitiesCountByYear);
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

		this.activitiesCount$.next(this.activitiesCount);
	}

	reset(): void {
		this.activitiesCount$.next([]);
	}
}
