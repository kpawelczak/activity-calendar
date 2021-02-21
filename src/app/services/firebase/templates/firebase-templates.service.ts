import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { WeekdayTemplatesRepository } from '../../repositories/templates/weekday-templates.repository';
import { WeekdayTemplate } from '../../repositories/templates/weekday-template';
import { TemplateActivity } from '../../../common/models/template-activity';
import { Weekday } from '../../repositories/templates/weekday';
import { ActivityCalendarSnackbarService } from '../../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';

@Injectable()
export class FirebaseTemplatesService extends ProfileCollection {

	constructor(private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
				private readonly acSnackBar: ActivityCalendarSnackbarService,
				profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getTemplate(weekday: Weekday): void {
		this.profileCollection()
			.doc('templates')
			.collection(weekday.toString())
			.valueChanges()
			.pipe(take(1))
			.subscribe((templates: any) => {
				const weekdayTemplate = new WeekdayTemplate(weekday, templates);
				this.weekdayTemplatesRepository.next(weekdayTemplate);
			});
	}

	saveActivityToTemplate(weekday: Weekday, templateActivity: TemplateActivity): Promise<void> {
		const UUID = templateActivity.templateUUID;

		return this.profileCollection()
				   .doc('templates')
				   .collection(weekday.toString())
				   .doc(UUID)
				   .set({
					   name: templateActivity.name,
					   reps: templateActivity.reps,
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
