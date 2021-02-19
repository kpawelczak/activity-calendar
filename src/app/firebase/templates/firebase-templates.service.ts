import { Injectable } from '@angular/core';
import { ProfileCollection } from '../profile/firebase-profile';
import { FirebaseProfileService } from '../profile/firebase-profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Activity } from '../../client/templates/activity';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { WeekdayTemplatesRepository } from '../../repositories/templates/weekday-templates.repository';
import { WeekdayTemplate } from '../../repositories/templates/weekday-template';

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

	saveActivityToTemplate(weekday: string, activity: Activity) {

		this.profileCollection()
			.doc('templates')
			.collection(weekday)
			.add({
				...activity
			})
			.then(() => {
				this.matSnackBar.open('Activity saved to template', '', {
					duration: 5000
				});
			});
	}

}
