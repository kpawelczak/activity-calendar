import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { take } from 'rxjs/operators';
import { CalendarActivity } from './month-activities/calendar-activity';
import Database = firebase.database.Database;

@Injectable()
export class CalendarFirebaseService {

	constructor(private readonly firestore: AngularFirestore) {
	}

	getActivities(selectedDate: Date): Observable<any> { // todo values from calendar
		return this.firestore
				   .collection('public')
				   .doc('activities')
				   .collection('days', (ref: CollectionReference<Database>) => {
					   return ref.where('day', '==', selectedDate.getTime());
				   })
				   .valueChanges()
				   .pipe(take(1));
	}

	addActivity(selectedDate: Date, formValues: CalendarActivity): void {
		const account = 'public', // todo
			dayInSeconds = selectedDate.getTime();

		this.firestore
			.collection(account)
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
		this.firestore
			.collection('public')
			.doc('activities')
			.collection('days')
			.doc(selectedDate.getTime().toString())
			.update({
				name: activity.name,
				reps: activity.reps
			});
	}
}
