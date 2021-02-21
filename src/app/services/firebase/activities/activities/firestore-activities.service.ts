import { Injectable } from '@angular/core';
import { ActivitiesRepository } from '../../../repositories/activities/activities.repository';
import firebase from 'firebase';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { CalendarActivity } from '../../../../common/models/calendar-activity';
import { ProfileCollection } from '../../../profile/profile-collection';
import { ProfileService } from '../../../profile/profile.service';
import Database = firebase.database.Database;
import DocumentData = firebase.firestore.DocumentData;

@Injectable()
export class FirestoreActivitiesService extends ProfileCollection {
	private static readonly MILLI_SECONDS_IN_WEEK = 604800000;

	constructor(private readonly monthActivitiesRepository: ActivitiesRepository,
				firebaseProfileService: ProfileService,
				firestore: AngularFirestore) {
		super(firebaseProfileService, firestore);
	}

	getMonthActivities(year: number, month: number): void {
		this.profileCollection()
			.doc('activities')
			.collection('days', (ref: CollectionReference<Database>) => {
				const startAt = this.getStartOfTheMonth(year, month) - FirestoreActivitiesService.MILLI_SECONDS_IN_WEEK,
					endAt = this.getStartOfTheMonth(year, month + 1) + FirestoreActivitiesService.MILLI_SECONDS_IN_WEEK;

				return ref.where('day', '>=', startAt)
						  .where('day', '<', endAt);
			})
			.valueChanges()
			.pipe(
				map((response: Array<DocumentData>) => {
					return response.map((calendarActivity: DocumentData) => {
						return new CalendarActivity(
							calendarActivity.day,
							calendarActivity.name,
							calendarActivity.reps,
							calendarActivity.activityUUID,
							calendarActivity.assignedTemplateUUID
						);
					});
				}),
				take(1))
			.subscribe((calendarActivities: Array<CalendarActivity>) => {
				this.monthActivitiesRepository.next(calendarActivities);
			});
	}

	private getStartOfTheMonth(year: number, month: number): number {
		return new Date(year, month, 1).getTime();
	}
}
