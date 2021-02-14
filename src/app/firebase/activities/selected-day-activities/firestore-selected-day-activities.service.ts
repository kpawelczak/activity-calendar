import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendarActivity } from '../month-activities/calendar-activity';
import { ProfileCollection } from '../../profile/firebase-profile';
import { FirebaseProfileService } from '../../profile/firebase-profile.service';
import firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable()
export class FirestoreSelectedDayActivitiesService extends ProfileCollection {

	constructor(firestore: AngularFirestore,
				firebaseProfileService: FirebaseProfileService) {
		super(firebaseProfileService, firestore);
	}

	addActivity(selectedDate: Date, formValues: CalendarActivity): Promise<DocumentReference> {
		const dayInSeconds = selectedDate.getTime();

		return this.profileCollection()
				   .doc('activities')
				   .collection('days')
				   .add({
					   day: dayInSeconds,
					   name: formValues.name,
					   reps: formValues.reps
				   });
	}

	updateActivity(selectedDate: Date, activity: CalendarActivity): Promise<void> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('days')
				   .doc(selectedDate.getTime().toString())
				   .update({
					   name: activity.name,
					   reps: activity.reps
				   });
	}

}
