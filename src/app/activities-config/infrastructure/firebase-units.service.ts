import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import DocumentData = firebase.firestore.DocumentData;

@Injectable()
export class FirebaseUnitsService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	loadUnits(): Observable<any> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('units')
				   .doc('units')
				   .valueChanges()
				   .pipe(
					   map((data: DocumentData) => {
						   this.setInitialUnits(data);
						   return data ? data : [];
					   }),
					   take(1)
				   );
	}

	private setInitialUnits(units: DocumentData) {
		if (units?.length === 0) {
			// todo boolean in db that it was already created
			this.profileCollection()
				.doc('activities')
				.collection('units')
				.doc('units')
				.set({
					units: ['km', 'h', 'kg', 'kcal', 'reps', 'sets']
				})
				.finally();
		}
	}
}
