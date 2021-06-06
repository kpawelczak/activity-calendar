import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore, CollectionReference } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import Database = firebase.database.Database;

@Injectable()
export class FirebaseTemplatesService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	loadTemplates(templateSetName?: string): Observable<any> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('templates', (ref: CollectionReference<Database>) => {
					   const setName = templateSetName ? templateSetName : 'default';
					   return ref.where('templateSetName', '==', setName);
				   })
				   .valueChanges();
	}
}
