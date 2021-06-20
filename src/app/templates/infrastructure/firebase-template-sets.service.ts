import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import { AngularFirestoreDocument } from '@angular/fire/firestore/document/document';
import DocumentData = firebase.firestore.DocumentData;


@Injectable()
export class FirebaseTemplateSetsService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getTemplateSets(): Observable<Array<string>> {
		return this.templateSetsDocument()
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

	editTemplate(templateSets: Array<string>): Observable<void> {
		return from(this.templateSetsDocument()
						.set({ templateSets }));
	}

	addTemplate(templateSetName: string): Observable<void> {
		return from(this.templateSetsDocument()
						.update({
							templateSets: firebase.firestore.FieldValue.arrayUnion(templateSetName)
						})
		);
	}

	deleteTemplate(templateSetName: string): Observable<void> {
		return from(this.templateSetsDocument()
						.update({
							templateSets: firebase.firestore.FieldValue.arrayRemove(templateSetName)
						}));
	}

	private templateSetsDocument(): AngularFirestoreDocument<DocumentData> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('template-sets')
				   .doc('sets');
	}

	private setDefaultTemplateSets(templateSets: Array<string>) {
		if (!templateSets) {
			this.templateSetsDocument()
				.set({ templateSets: ['default'] })
				.finally();
		}
	}
}
