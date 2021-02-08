import { Injectable } from '@angular/core';
import { FirestoreMonthActivitiesRepository } from './firestore-month-activities.repository';
import firebase from 'firebase';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import Database = firebase.database.Database;

@Injectable()
export class FirestoreMonthActivitiesService {
	private static readonly MILLI_SECONDS_IN_WEEK = 604800000;

	constructor(private readonly firestore: AngularFirestore,
				private readonly monthActivitiesRepository: FirestoreMonthActivitiesRepository) {
	}

	getMonthActivities(year: number, month: number): void {
		this.firestore
			.collection('public')
			.doc('activities')
			.collection('days', (ref: CollectionReference<Database>) => {
				const statAt = this.getStartOfTheMonth(year, month) - FirestoreMonthActivitiesService.MILLI_SECONDS_IN_WEEK,
					endAt = this.getStartOfTheMonth(year, month + 1) + FirestoreMonthActivitiesService.MILLI_SECONDS_IN_WEEK;

				return ref.where('day', '>=', statAt)
						  .where('day', '<', endAt);
			})
			.valueChanges()
			.pipe(take(1))
			.subscribe((response) => {
				this.monthActivitiesRepository.next(response);
			});
	}

	private getStartOfTheMonth(year: number, month: number): number {
		return new Date(year, month, 1).getTime();
	}
}
