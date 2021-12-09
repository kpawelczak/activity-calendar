import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { map, take } from 'rxjs/operators';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { ProfileCollection } from '../../domain/profile/profile-collection';
import { ProfileService } from '../../domain/profile/profile.service';
import { Observable } from 'rxjs';
import Database = firebase.database.Database;
import DocumentData = firebase.firestore.DocumentData;
import { QuantifiedActivity } from '../../../common/ui/quantified-activity/quantified-activity';


interface FirebaseQuantifiedActivity {
	unit: string;
	value: string;
}

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
								   this.convertToQuantifiedActivities(calendarActivity.quantifiedActivities),
								   // calendarActivity.quantifiedActivities,
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

	private convertToQuantifiedActivities(quantifiedActivities: Array<FirebaseQuantifiedActivity>): Array<QuantifiedActivity> {
		return quantifiedActivities ? quantifiedActivities
			.map((quantifiedActivity: QuantifiedActivity) => {
				return new QuantifiedActivity(quantifiedActivity.value, quantifiedActivity.unit);
			})
			: []
	}
}
