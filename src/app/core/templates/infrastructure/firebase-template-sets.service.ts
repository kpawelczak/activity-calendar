import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../domain/profile/profile-collection';
import { ProfileService } from '../../domain/profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import { AngularFirestoreDocument } from '@angular/fire/firestore/document/document';
import { TemplateSet } from '../store/sets/template-set';
import { v4 as uuidv4 } from 'uuid';
import DocumentData = firebase.firestore.DocumentData;
import { defaultTemplateSet } from '../store/sets/default-template-set-name';


@Injectable()
export class FirebaseTemplateSetsService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getTemplateSets(): Observable<Array<TemplateSet>> {
		return this.templateSetsDocument()
				   .valueChanges()
				   .pipe(
					   map((data: DocumentData) => {
						   const templateSets = data?.templateSets;
						   this.setDefaultTemplateSets(templateSets);
						   return templateSets ? templateSets : [defaultTemplateSet];
					   }),
					   take(1)
				   );
	}

	editTemplate(templateSets: Array<TemplateSet>): Observable<void> {
		return from(this.templateSetsDocument()
						.set({ templateSets }));
	}

	addTemplate(name: string): Observable<TemplateSet> {
		const uuid = uuidv4(),
			templateSet = { name, uuid };
		return from(this.templateSetsDocument()
						.update({
							templateSets: firebase.firestore.FieldValue.arrayUnion(templateSet)
						})
		)
			.pipe(
				map(() => templateSet)
			);
	}

	deleteTemplate(templateSet: TemplateSet): Observable<void> {
		return from(this.templateSetsDocument()
						.update({
							templateSets: firebase.firestore.FieldValue.arrayRemove(templateSet)
						}));
	}

	private templateSetsDocument(): AngularFirestoreDocument<DocumentData> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('template-sets')
				   .doc('sets');
	}

	private setDefaultTemplateSets(templateSets: Array<TemplateSet>) {
		if (!templateSets) {
			this.templateSetsDocument()
				.set({ templateSets: ['default'] })
				.finally();
		}
	}
}
