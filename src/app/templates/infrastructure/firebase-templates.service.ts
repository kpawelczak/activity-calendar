import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore, CollectionReference, DocumentData } from '@angular/fire/firestore';
import firebase from 'firebase';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { TemplateActivity } from '../template-activity';
import { WeekdayTemplate } from '../store/weekday-template';
import { WeekdayTemplates } from '../store/weekday-templates';
import { ActiveTemplateSetService } from '../store/sets/active-template-set.service';
import Database = firebase.database.Database;


@Injectable()
export class FirebaseTemplatesService extends ProfileCollection {

	constructor(private readonly activeTemplateSetService: ActiveTemplateSetService,
				profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	loadTemplates(): Observable<Array<WeekdayTemplate>> {
		return this.activeTemplateSetService
				   .onValues()
				   .pipe(
					   switchMap((templateSetName: string) => {
						   return this.profileCollection()
									  .doc('templates')
									  .collection('templates', (ref: CollectionReference<Database>) => {
										  const setName = templateSetName ? templateSetName : 'default';
										  return ref.where('templateSetName', '==', setName);
									  })
									  .valueChanges();
					   })
				   )
				   .pipe(
					   map((data: DocumentData) => {
						   const templates = data?.map((templateActivity: TemplateActivity) => templateActivity);
						   return this.getWeekdayTemplates(templates);
					   }),
					   take(1)
				   );
	}

	private getWeekdayTemplates(templates: Array<TemplateActivity>): Array<WeekdayTemplate> {
		const newWeekdayTemplates = [...WeekdayTemplates.getPristineWeekdayTemplates()];

		templates.forEach((templateActivity: TemplateActivity) => {
			const newWeekdayIndex
				= newWeekdayTemplates
				.findIndex((weekdayTemplate: WeekdayTemplate) => weekdayTemplate.getWeekday() === templateActivity.weekday);

			const newTemplateActivity
				= new TemplateActivity(
				templateActivity.weekday,
				templateActivity.name,
				templateActivity.amount,
				templateActivity.templateUUID,
				templateActivity.templateSetName);

			newWeekdayTemplates[newWeekdayIndex].addTemplate(newTemplateActivity);
		});

		return newWeekdayTemplates;
	}
}
