import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import firebase from 'firebase';
import { take } from 'rxjs/operators';
import Database = firebase.database.Database;

@Injectable()
export class CalendarFirebaseService {

	constructor(private readonly firestore: AngularFirestore) {
	}

	getActivities(selectedDate: Date): Observable<any> {
		return this.firestore
				   .collection('public')
				   .doc('activities')
				   .collection('days', (ref: CollectionReference<Database>) => {
					   return ref.where('day', '==', selectedDate.getTime());
				   })
				   .valueChanges()
				   .pipe(take(1));
	}

	addActivity(selectedDate: Date, formValues: any): void {
		const account = 'public',
			dayInSeconds = selectedDate.getTime();

		this.firestore
			.collection(account)
			.doc('activities')
			.collection('days')
			.add({
				day: dayInSeconds,
				name: formValues.activityName,
				reps: formValues.activityReps
			});
	}
}
