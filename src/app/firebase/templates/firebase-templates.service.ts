import { Injectable } from '@angular/core';
import { ProfileCollection } from '../profile/firebase-profile';
import { FirebaseProfileService } from '../profile/firebase-profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { WeekdayTemplatesRepository } from '../../repositories/templates/weekday-templates.repository';
import { WeekdayTemplate } from '../../repositories/templates/weekday-template';
import { TemplateActivity } from '../../repositories/templates/template-activity';

@Injectable()
export class FirebaseTemplatesService extends ProfileCollection {

	constructor(private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
				private readonly matSnackBar: MatSnackBar,
				profileService: FirebaseProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getTemplate(weekday: string) {
		this.profileCollection()
			.doc('templates')
			.collection(weekday)
			.valueChanges()
			.pipe(take(1))
			.subscribe((templates: any) => {
				const weekdayTemplate = new WeekdayTemplate(weekday, templates);
				this.weekdayTemplatesRepository.next(weekdayTemplate);
			});
	}

	saveActivityToTemplate(weekday: string, templateActivity: TemplateActivity): Promise<void> {
		const UUID = templateActivity.UUID;

		return this.profileCollection()
				   .doc('templates')
				   .collection(weekday)
				   .doc(UUID)
				   .set({
					   name: templateActivity.name,
					   reps: templateActivity.reps,
					   UUID
				   })
				   .then(() => {
					   this.matSnackBar.open('Activity saved to template', '', {
						   duration: 5000
					   });
				   });
	}

	deleteTemplateActivity(weekday: string, templateActivityUUID: string): Promise<void> {

		return this.profileCollection()
				   .doc('templates')
				   .collection(weekday)
				   .doc(templateActivityUUID)
				   .delete()
				   .then(() => {
					   this.matSnackBar.open('Activity deleted from template', '', {
						   duration: 5000
					   });
				   });
	}

}
