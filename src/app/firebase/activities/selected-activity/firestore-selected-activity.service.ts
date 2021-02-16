import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendarActivity } from '../month-activities/calendar-activity';
import { ProfileCollection } from '../../profile/firebase-profile';
import { FirebaseProfileService } from '../../profile/firebase-profile.service';
import { FirestoreMonthActivitiesRepository } from '../month-activities/firestore-month-activities.repository';

@Injectable()
export class FirestoreSelectedActivityService extends ProfileCollection {

	constructor(private readonly monthActivitiesRepository: FirestoreMonthActivitiesRepository,
				firestore: AngularFirestore,
				firebaseProfileService: FirebaseProfileService) {
		super(firebaseProfileService, firestore);
	}

	addActivity(activity: CalendarActivity): Promise<void> {

		return this.profileCollection()
				   .doc('activities')
				   .collection('days')
				   .doc(activity.UUID)
				   .set({
					   ...activity
				   });
	}

	updateActivity(activity: CalendarActivity): Promise<void> {

		return this.profileCollection()
				   .doc('activities')
				   .collection('days')
				   .doc(activity.UUID)
				   .update({
					   name: activity.name,
					   reps: activity.reps
				   });
	}

	deleteActivity(activity: CalendarActivity): Promise<void> {

		return this.profileCollection()
				   .doc('activities')
				   .collection('days')
				   .doc(activity.UUID)
				   .delete();
	}

}
