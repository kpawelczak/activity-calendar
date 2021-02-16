import { Injectable } from '@angular/core';
import { FirestoreMonthActivitiesRepository } from './firestore-month-activities.repository';
import firebase from 'firebase';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { CalendarActivity } from './calendar-activity';
import { ProfileCollection } from '../../profile/firebase-profile';
import { FirebaseProfileService } from '../../profile/firebase-profile.service';
import Database = firebase.database.Database;

@Injectable()
export class FirestoreMonthActivitiesService extends ProfileCollection {
	private static readonly MILLI_SECONDS_IN_WEEK = 604800000;

	constructor(private readonly monthActivitiesRepository: FirestoreMonthActivitiesRepository,
				firebaseProfileService: FirebaseProfileService,
				firestore: AngularFirestore) {
		super(firebaseProfileService, firestore);
	}

	getMonthActivities(year: number, month: number): void {
		this.profileCollection()
			.doc('activities')
			.collection('days', (ref: CollectionReference<Database>) => {
				const startAt = this.getStartOfTheMonth(year, month) - FirestoreMonthActivitiesService.MILLI_SECONDS_IN_WEEK,
					endAt = this.getStartOfTheMonth(year, month + 1) + FirestoreMonthActivitiesService.MILLI_SECONDS_IN_WEEK;

				return ref.where('day', '>=', startAt)
						  .where('day', '<', endAt);
			})
			.valueChanges()
			.pipe(take(1))
			.subscribe((response: Array<CalendarActivity>) => {
				this.monthActivitiesRepository.next(response);
			});
	}

	private getStartOfTheMonth(year: number, month: number): number {
		return new Date(year, month, 1).getTime();
	}
}
