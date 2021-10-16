import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../domain/profile/profile-collection';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import { ActivityConfig } from '../store/activity-config';
import { ActivityEntry } from '../store/activity-entry';
import { ProfileService } from '../../domain/profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import DocumentData = firebase.firestore.DocumentData;

interface FirebaseDefinedActivity {
	name: string;
	entries: Array<string>;
	uuid: string;
}

@Injectable()
export class FirebaseDefinedActivitiesService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	loadDefinedActivities(): Observable<any> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('defined-activities')
				   .valueChanges()
				   .pipe(
					   map((data: DocumentData) => {
						   const definedActivities = data?.map((firebaseDefinedActivity: FirebaseDefinedActivity) => {
							   const activityEntries = this.getActivityEntries(firebaseDefinedActivity.entries);
							   return new ActivityConfig(firebaseDefinedActivity.name, activityEntries, firebaseDefinedActivity.uuid);
						   });
						   this.setInitialList(definedActivities);
						   return definedActivities ? definedActivities : [];
					   }),
					   take(1)
				   );
	}

	private getActivityEntries(activityConfig: Array<string>): Array<ActivityEntry> {
		return activityConfig?.map((entryUnit: string) => new ActivityEntry(entryUnit));
	}

	private setInitialList(definedActivities: Array<ActivityConfig>) {
		if (!definedActivities) {
			// this.profileCollection()
			// 	.doc('activities')
			// 	.collection('defined-activities')
		}
	}
}
