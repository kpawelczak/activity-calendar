import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';
import DocumentData = firebase.firestore.DocumentData;

@Injectable()
export class FirebaseActiveTemplateSetService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getActiveTemplateSet(): Observable<string> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('active-template-set')
				   .doc('active-set')
				   .valueChanges()
				   .pipe(
					   map((data: DocumentData) => data?.setName)
				   );
	}
}
