import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import firebase from 'firebase';
import { ActivitiesCount } from '../store/count/activities-count';
import { ActivitiesCountMonth } from '../store/count/activities-count-month';
import DocumentData = firebase.firestore.DocumentData;

@Injectable()
export class FirebaseActivitiesCountService extends ProfileCollection {

	constructor(firebaseProfileService: ProfileService,
				firestore: AngularFirestore) {
		super(firebaseProfileService, firestore);
	}

	getActivitiesCount(): Observable<Array<ActivitiesCount>> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('activities-count')
				   .doc('activities-count')
				   .valueChanges()
				   .pipe(
					   map((data: Array<DocumentData>) => {
						   this.setActivitiesCountCollection(data);
						   return data;
					   }),
					   filter((data: Array<DocumentData>) => !!data),
					   map((data: Array<DocumentData>) => {
							   return Object.keys(data)
											.map((key: string) => {
												const monthActivitiesCount = data[key]
													.map((month: { month: number, count: number }) => {
														return new ActivitiesCountMonth(month.month, month.count);
													});
												return new ActivitiesCount(Number(key), monthActivitiesCount);
											});
						   }
					   ),
					   take(1)
				   );
	}

	updateActivitiesCount(activitiesCountByYear: ActivitiesCount): void {

		const updatedYearCount = activitiesCountByYear
			.months
			.map((activitiesCountMonth: ActivitiesCountMonth) => {
				return { month: activitiesCountMonth.month, count: activitiesCountMonth.getCount() };
			});

		this.profileCollection()
			.doc('activities')
			.collection('activities-count')
			.doc('activities-count')
			.update({
				[activitiesCountByYear.year.toString()]: [
					...updatedYearCount
				]
			})
			.then();
	}

	private setActivitiesCountCollection(activitiesCount: Array<DocumentData>) {
		if (!activitiesCount) {
			this.profileCollection()
				.doc('activities')
				.collection('activities-count')
				.doc('activities-count')
				.set({})
				.finally();
		}
	}
}
