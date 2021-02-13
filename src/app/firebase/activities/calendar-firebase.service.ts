import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { take } from 'rxjs/operators';
import { CalendarActivity } from './month-activities/calendar-activity';
import { ProfileCollection } from '../profile/firebase-profile';
import { FirebaseProfileService } from '../profile/firebase-profile.service';
import Database = firebase.database.Database;

@Injectable()
export class CalendarFirebaseService extends ProfileCollection {

	constructor(firestore: AngularFirestore,
				firebaseProfileService: FirebaseProfileService) {
		super(firebaseProfileService, firestore);
	}

	getActivities(selectedDate: Date): Observable<any> { // todo values from calendar
		return this.profileCollection()
				   .doc('activities')
				   .collection('days', (ref: CollectionReference<Database>) => {
					   return ref.where('day', '==', selectedDate.getTime());
				   })
				   .valueChanges()
				   .pipe(take(1));
	}

	addActivity(selectedDate: Date, formValues: CalendarActivity): void {
		const dayInSeconds = selectedDate.getTime();

		this.profileCollection()
			.doc('activities')
			.collection('days')
			.doc(dayInSeconds.toString())
			.set({
				day: dayInSeconds,
				name: formValues.name,
				reps: formValues.reps
			});
	}

	updateActivity(selectedDate: Date, activity: CalendarActivity): void {
		this.profileCollection()
			.doc('activities')
			.collection('days')
			.doc(selectedDate.getTime().toString())
			.update({
				name: activity.name,
				reps: activity.reps
			});
	}
}
