import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import DocumentData = firebase.firestore.DocumentData;


@Injectable()
export class FirebaseTemplateSetsService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getTemplateSets(): Observable<Array<string>> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('template-sets')
				   .doc('sets')
				   .valueChanges()
				   .pipe(
					   map((data: DocumentData) => {
						   const templateSets = data?.templateSets;
						   this.setDefaultTemplateSets(templateSets);
						   return templateSets ? templateSets : ['default'];
					   }),
					   take(1)
				   );
	}

	private setDefaultTemplateSets(templateSets: Array<string>) {
		if (!templateSets) {
			this.profileCollection()
				.doc('templates')
				.collection('template-sets')
				.doc('sets')
				.set({ templateSets: ['default'] })
				.finally();
		}
	}
}
