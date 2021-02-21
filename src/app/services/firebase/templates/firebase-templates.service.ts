import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { WeekdayTemplatesRepository } from '../../repositories/templates/weekday-templates.repository';
import { WeekdayTemplate } from '../../repositories/templates/weekday-template';
import { TemplateActivity } from '../../../common/models/template-activity';
import { Weekday } from '../../repositories/templates/weekday';

@Injectable()
export class FirebaseTemplatesService extends ProfileCollection {

	constructor(private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
				private readonly matSnackBar: MatSnackBar,
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
				   .then(() => {
					   this.matSnackBar.open('Activity saved to template', '', {
						   panelClass: 'ac-snackbar',
						   duration: 5000
					   });
				   });
	}

	deleteTemplateActivity(weekday: Weekday, templateActivityUUID: string): Promise<void> {

		return this.profileCollection()
				   .doc('templates')
				   .collection(weekday.toString())
				   .doc(templateActivityUUID)
				   .delete()
				   .then(() => {
					   this.matSnackBar.open('Activity deleted from template', '', {
						   panelClass: 'ac-snackbar',
						   duration: 5000
					   });
				   });
	}

}
