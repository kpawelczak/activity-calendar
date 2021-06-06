import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TemplateActivity } from '../template-activity';
import { ActivityCalendarSnackbarService } from '../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';
import { Weekday } from '../weekday';


@Injectable()
export class FirebaseTemplateService extends ProfileCollection {

	constructor(private readonly acSnackBar: ActivityCalendarSnackbarService,
				profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	saveActivityToTemplate(weekday: Weekday, templateActivity: TemplateActivity): Promise<void> {
		const UUID = templateActivity.templateUUID;

		return this.profileCollection()
				   .doc('templates')
				   .collection(weekday.toString())
				   .doc(UUID)
				   .set({
					   name: templateActivity.name,
					   amount: templateActivity.amount,
					   templateUUID: UUID
				   })
				   .catch((error) => {
					   this.acSnackBar.notify(error, { warn: true });
				   })
				   .then(() => {
					   this.acSnackBar.notify('Activity saved to template');
				   });
	}

	deleteTemplateActivity(weekday: Weekday, templateActivityUUID: string): Promise<void> {

		return this.profileCollection()
				   .doc('templates')
				   .collection(weekday.toString())
				   .doc(templateActivityUUID)
				   .delete()
				   .catch((error) => {
					   this.acSnackBar.notify(error, { warn: true });
				   })
				   .then(() => {
					   this.acSnackBar.notify('Activity deleted from template');
				   });
	}

}
