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
				.doc(activityConfig.getUUID())
				.set({
						name: activityConfig.name,
						entries: activityConfig.entries.map((activityEntry: ActivityEntry) => activityEntry.entryUnit),
						uuid: activityConfig.getUUID()
					}
				)
		);
	}

	editDefinedActivity(activityConfig: ActivityConfig): Observable<void> {
		return from(
			this.definedActivitiesDocument()
				.doc(activityConfig.getUUID())
				.set({
						name: activityConfig.name,
						entries: activityConfig.entries.map((activityEntry: ActivityEntry) => activityEntry.entryUnit),
						uuid: activityConfig.getUUID()
					}
				)
		);
	}

	deleteDefinedActivity(activityConfigUUID: string): Observable<void> {
		return from(
			this.definedActivitiesDocument()
				.doc(activityConfigUUID)
				.delete()
		);
	}

	private definedActivitiesDocument(): AngularFirestoreCollection<DocumentData> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('defined-activities');
	}
}
