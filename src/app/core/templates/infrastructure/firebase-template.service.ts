import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../domain/profile/profile-collection';
import { ProfileService } from '../../domain/profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TemplateActivity } from '../template-activity';
import { ActivityCalendarSnackbarService } from '../../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';
import { ActiveTemplateSetService } from '../store/sets/active-template-set.service';
import { switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';


@Injectable()
export class FirebaseTemplateService extends ProfileCollection {

	constructor(private readonly acSnackBar: ActivityCalendarSnackbarService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	saveActivityToTemplate(templateActivity: TemplateActivity): Observable<any> {
		const UUID = templateActivity.templateUUID;
		return this.activeTemplateSetService
				   .onValues()
				   .pipe(
					   switchMap((templateSetName: string) => {
						   return from(this.profileCollection()
										   .doc('templates')
										   .collection('templates')
										   .doc(UUID)
										   .set({
											   weekday: templateActivity.weekday,
											   name: templateActivity.name,
											   dimensionedActivities: templateActivity.quantifiedActivity,
											   templateUUID: UUID,
											   templateSetName
										   })
										   .catch((error) => {
											   this.acSnackBar.notify(error, { warn: true });
										   })
										   .then(() => {
											   this.acSnackBar.notify('Activity saved to template');
										   })
						   );
					   })
				   );
	}

	editActivityTemplate(templateActivity: TemplateActivity,
						 templateSetName: string): Observable<any> {
		return from(this.profileCollection()
						.doc('templates')
						.collection('templates')
						.doc(templateActivity.templateUUID)
						.set({
							...templateActivity,
							templateSetName
						})
						.catch((error) => {
							this.acSnackBar.notify(error, { warn: true });
						})
		);
	}

	deleteTemplateActivity(templateActivityUUID: string): Promise<void> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('templates')
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
