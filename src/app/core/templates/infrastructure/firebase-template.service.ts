import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../domain/profile/profile-collection';
import { ProfileService } from '../../domain/profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TemplateActivity } from '../template-activity';
import { ActivityCalendarSnackbarService } from '../../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';
import { ActiveTemplateSetService } from '../store/sets/active-template-set.service';
import { switchMap } from 'rxjs/operators';
import { from, Observable } from 'rxjs';
import { TemplateSet } from '../store/sets/template-set';
import { QuantifiedActivity } from '../../../common/ui/quantified-activity/quantified-activity';


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
					   switchMap((templateSet: TemplateSet) => {
						   return from(this.profileCollection()
										   .doc('templates')
										   .collection('templates')
										   .doc(UUID)
										   .set({
											   weekday: templateActivity.weekday,
											   name: templateActivity.name,
											   quantifiedActivities: this.convertQuantifiedActivities(templateActivity.quantifiedActivities),
											   templateUUID: UUID,
											   templateSetUUID: templateSet.uuid
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
						 templateSet: TemplateSet): Observable<any> {
		return from(this.profileCollection()
						.doc('templates')
						.collection('templates')
						.doc(templateActivity.templateUUID)
						.set({
							...templateActivity,
							templateSetUUID: templateSet.uuid
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

	// todo separate class
	private convertQuantifiedActivities(quantifiedActivities: Array<QuantifiedActivity>) {
		return quantifiedActivities.map((quantifiedActivity: QuantifiedActivity) => {
			return {
				value: quantifiedActivity.value,
				unit: quantifiedActivity.unit
			};
		});
	}
}
