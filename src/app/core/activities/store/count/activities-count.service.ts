import { Injectable } from '@angular/core';
import { ActivitiesCountRepository } from './activities-count.repository';
import { ActivitiesCountMonth } from './activities-count-month';
import { ActivitiesCount } from './activities-count';
import { FirebaseActivitiesCountService } from '../../infrastructure/firebase-activities-count.service';
import { ActivitiesStorage } from '../../storage/activities.storage';
import { AuthenticationService } from '../../../../authentication/authentication.service';
import { take } from 'rxjs/operators';
import { Reactive } from '../../../../common/cdk/reactive';

@Injectable()
export class ActivitiesCountService extends Reactive {

	constructor(private readonly activitiesCountRepository: ActivitiesCountRepository,
				private readonly firebaseActivitiesCountService: FirebaseActivitiesCountService,
				private readonly activitiesStorage: ActivitiesStorage,
				private readonly authService: AuthenticationService) {
		super();
	}

	updateCount(day: Date, increment?: boolean): void {
		let activitiesCount = this.activitiesCountRepository.getValues();

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

		this.activitiesCountRepository.next(activitiesCount);
		this.updateLocalActivitiesCount(activitiesCount);
	}


	private updateLocalActivitiesCount(activitiesCount: Array<ActivitiesCount>): void {
		this.authService
			.onLoggedIn()
			.pipe(
				take(1),
				this.takeUntil()
			)
			.subscribe((loggedIn: boolean) => {
				this.activitiesStorage.storeActivitiesCount(activitiesCount, loggedIn);
			});
	}
}
