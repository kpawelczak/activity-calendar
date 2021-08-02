import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { Observable } from 'rxjs';
import Database = firebase.database.Database;
import DocumentData = firebase.firestore.DocumentData;

@Injectable()
export class FirebaseActivitiesService extends ProfileCollection {

	private static readonly MILLI_SECONDS_IN_WEEK = 604800000;

	constructor(firebaseProfileService: ProfileService,
				firestore: AngularFirestore) {
		super(firebaseProfileService, firestore);
	}

	getMonthActivities(year: number, month: number): Observable<Array<CalendarActivity>> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('days', (ref: CollectionReference<Database>) => {
					   const startAt = this.getStartOfTheMonth(year, month) - FirebaseActivitiesService.MILLI_SECONDS_IN_WEEK * 2,
						   endAt = this.getStartOfTheMonth(year, month + 1) + FirebaseActivitiesService.MILLI_SECONDS_IN_WEEK * 2;

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
								   calendarActivity.dimensionedActivities,
								   {
									   activityUUID: calendarActivity.activityUUID,
									   assignedTemplateUUID: calendarActivity.assignedTemplateUUID
								   }
							   );
						   });
					   }),
					   map((calendarActivities: Array<CalendarActivity>) => {
						   return calendarActivities.length === 0 ? [] : calendarActivities;
					   }),
					   take(1)
				   );
	}

	private getStartOfTheMonth(year: number, month: number): number {
		return new Date(year, month, 1).getTime();
	}
}
