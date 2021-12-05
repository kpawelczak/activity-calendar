import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { ProfileCollection } from '../../domain/profile/profile-collection';
import { ProfileService } from '../../domain/profile/profile.service';
import { ActivityCalendarSnackbarService } from '../../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';
import { QuantifiedActivity } from '../../../common/ui/quantified-activity/quantified-activity';

interface FirebaseQuantifiedActivity {
	unit: string;
	value: string;
}

@Injectable()
export class FirebaseActivityService extends ProfileCollection {

	constructor(private readonly acSnackBar: ActivityCalendarSnackbarService,
				firestore: AngularFirestore,
				firebaseProfileService: ProfileService) {
		super(firebaseProfileService, firestore);
	}

	addActivity(activity: CalendarActivity): Promise<void> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('days')
				   .doc(activity.getActivityUUID())
				   .set({
					   ...activity,
					   quantifiedActivities: this.convertQuantifiedActivities(activity.quantifiedActivities),
					   activityUUID: activity.getActivityUUID(),
					   assignedTemplateUUID: activity.getAssignedTemplateUUID()
				   })
				   .catch((error) => {
					   this.acSnackBar.notify(error, { warn: true });
				   })
				   .then(() => {
					   this.acSnackBar.notify('Activity added');
				   });
	}

	updateActivity(activity: CalendarActivity): Promise<void> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('days')
				   .doc(activity.getActivityUUID())
				   .set({
					   ...activity,
					   name: activity.name,
					   quantifiedActivities: this.convertQuantifiedActivities(activity.quantifiedActivities)
				   })
				   .catch((error) => {
					   this.acSnackBar.notify(error, { warn: true });
				   })
				   .then(() => {
					   this.acSnackBar.notify('Activity updated');
				   });
	}

	deleteActivity(activity: CalendarActivity): Promise<void> {
		return this.profileCollection()
				   .doc('activities')
				   .collection('days')
				   .doc(activity.getActivityUUID())
				   .delete()
				   .catch((error) => {
					   this.acSnackBar.notify(error, { warn: true });
				   })
				   .then(() => {
					   this.acSnackBar.notify('Activity removed');
				   });
	}

	private convertQuantifiedActivities(quantifiedActivities: Array<QuantifiedActivity>): Array<FirebaseQuantifiedActivity> {
		return quantifiedActivities
			.map((quantifiedActivity: QuantifiedActivity) => {
				return { unit: quantifiedActivity.getUnit(), value: quantifiedActivity.getValue() };
			});
	}
}
