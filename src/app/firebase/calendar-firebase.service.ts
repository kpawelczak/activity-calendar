import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable()
export class CalendarFirebaseService {

	constructor(private readonly firestore: AngularFirestore) {
	}

	getPublic() {
		return this.firestore
				   .collection('public')
				   .doc('activities')
				   .collection('2020')
				   .doc('0')
				   .collection('1')
				   .valueChanges();
	}
}
