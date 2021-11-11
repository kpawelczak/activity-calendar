import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../domain/profile/profile-collection';
import { ProfileService } from '../../domain/profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';
import { defaultTemplateSet } from '../store/sets/default-template-set-name';
import { TemplateSet } from '../store/sets/template-set';
import DocumentData = firebase.firestore.DocumentData;


@Injectable()
export class FirebaseActiveTemplateSetService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getActiveTemplateSet(): Observable<TemplateSet> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('template-sets')
				   .doc('active')
				   .valueChanges()
				   .pipe(
					   map((data: DocumentData) => {
						   const templateSet = data?.templateSet;
						   this.setDefaultTemplateSet(templateSet);
						   return templateSet ? templateSet : defaultTemplateSet;
					   })
				   );
	}

	changeActiveTemplateSet(templateSet: TemplateSet): Promise<void> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('template-sets')
				   .doc('active')
				   .update({ templateSet });
	}

	private setDefaultTemplateSet(templateSet: string) {
		if (!templateSet) {
			this.profileCollection()
				.doc('templates')
				.collection('template-sets')
				.doc('active')
				.set({ templateSet: defaultTemplateSet })
				.finally();
		}
	}
}
