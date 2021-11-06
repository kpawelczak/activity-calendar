import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { ProfileCollection } from '../../domain/profile/profile-collection';
import firebase from 'firebase';
import { ProfileService } from '../../domain/profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { v4 as uuidv4 } from 'uuid';
import DocumentData = firebase.firestore.DocumentData;

@Injectable()
export class FirebaseActivitiesChangesService extends ProfileCollection {

	constructor(firebaseProfileService: ProfileService,
				firestore: AngularFirestore) {
		super(firebaseProfileService, firestore);
	}

	onChangesId(doc: string, collection: string): Observable<string> {
		return this.profileCollection()
				   .doc(doc)
				   .collection(collection)
				   .doc('changesId')
				   .valueChanges()
				   .pipe(
					   map((documentData: DocumentData) => {
						   return documentData.changesId;
					   }),
					   take(1)
				   );
	}

	registerNewChanges(doc: string, collection: string): Observable<string> {
		const changesId = uuidv4();

		return from(
			this.profileCollection()
				.doc(doc)
				.collection(collection)
				.doc('changesId')
				.set({ changesId }))
			.pipe(
				map(() => changesId)
			);
	}

}
