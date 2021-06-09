import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { CalendarActivity } from '../store/activities/calendar-activity';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { ActivitiesRepository } from '../store/activities/activities.repository';
import { ActivityCalendarSnackbarService } from '../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';

@Injectable()
export class FirebaseActivityService extends ProfileCollection {

	constructor(private readonly monthActivitiesRepository: ActivitiesRepository,
				private readonly acSnackBar: ActivityCalendarSnackbarService,
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
				   .update({
					   name: activity.name,
					   amount: activity.amount
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
}
