import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import firebase from 'firebase';
import { ActivityConfig } from '../store/activity-config';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { ActivityEntry } from '../store/activity-entry';
import DocumentData = firebase.firestore.DocumentData;

@Injectable()
export class FirebaseDefinedActivityService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	addDefinedActivity(activityConfig: ActivityConfig): Observable<void> {
		return from(
			this.definedActivitiesDocument()
				.doc(activityConfig.name)
				.set({
						name: activityConfig.name,
						entries: activityConfig.entries.map((activityEntry: ActivityEntry) => activityEntry.entryUnit)
					}
				)
		);
	}

	editDefinedActivity(activityConfig: ActivityConfig, oldActivityConfigName: string): Observable<void> {
		const isDocNameChanged = activityConfig.name !== oldActivityConfigName,
			docName = isDocNameChanged ? activityConfig.name : oldActivityConfigName;

		return from(
			this.definedActivitiesDocument()
				.doc(docName)
				.set({
						name: docName,
						entries: activityConfig.entries.map((activityEntry: ActivityEntry) => activityEntry.entryUnit)
					}
				)
				.then(() => {
					if (isDocNameChanged) {
						this.definedActivitiesDocument().doc(oldActivityConfigName).delete().finally();
					}
				})
		);
	}

	deleteDefinedActivity(activityConfigName: string): Observable<void> {
		return from(
			this.definedActivitiesDocument()
				.doc(activityConfigName)
				.delete()
		);
	}

	private definedActivitiesDocument(): AngularFirestoreCollection<DocumentData> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('defined-activities');
	}
}
