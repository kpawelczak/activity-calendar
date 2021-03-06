import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';
import { defaultTemplateSetName } from '../store/sets/default-template-set-name';
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
				   .collection('template-sets')
				   .doc('active')
				   .valueChanges()
				   .pipe(
					   map((data: DocumentData) => {
						   const templateName = data?.templateName;
						   this.setDefaultTemplateSet(templateName);
						   return templateName ? templateName : defaultTemplateSetName;
					   })
				   );
	}

	changeActiveTemplateSet(templateName: string): Promise<void> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('template-sets')
				   .doc('active')
				   .update({ templateName });
	}

	private setDefaultTemplateSet(templateName: string) {
		if (!templateName) {
			this.profileCollection()
				.doc('templates')
				.collection('template-sets')
				.doc('active')
				.set({ templateName: defaultTemplateSetName })
				.finally();
		}
	}
}
