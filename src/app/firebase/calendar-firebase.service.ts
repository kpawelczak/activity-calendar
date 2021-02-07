import { Injectable } from '@angular/core';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import firebase from 'firebase';
import Database = firebase.database.Database;

@Injectable()
export class CalendarFirebaseService {

	constructor(private readonly firestore: AngularFirestore) {
	}

	addActivity(selectedDate: Date): void {
		const account = 'public',
			dayInSeconds = selectedDate.getTime();

		this.firestore
			.collection(account)
			.doc('activities')
			.collection('days')
			.add({ day: dayInSeconds });
	}

	getPublic(year: number = 2021) {
		const account = 'public';

		return this.firestore
				   .collection(account)
				   .doc('activities')
				   .collection('years', (ref: CollectionReference<Database>) => {
					   return ref.where('day', '>=', this.startOfTheYear(year))
								 .where('day', '<', this.startOfTheYear(year + 1));
				   })
				   .valueChanges();
	}

	private startOfTheYear(year: number): number {
		return new Date(year, 0, 1).getTime();
	}
}
