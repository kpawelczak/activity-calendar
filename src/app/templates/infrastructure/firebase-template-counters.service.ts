import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TemplateCounter } from '../store/counters/template-counter';


@Injectable()
export class FirebaseTemplateCountersService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getTemplateCounters(templateSetName?: string): Observable<TemplateCounter> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('templates-counter')
				   .doc(this.getTemplateCounterDocName(templateSetName))
				   .valueChanges()
				   .pipe(take(1));
	}

	updateTemplateCounters(templateCounters: TemplateCounter, templateSetName?: string): void {
		this.profileCollection()
			.doc('templates')
			.collection('templates-counter')
			.doc(this.getTemplateCounterDocName(templateSetName))
			.update({
				...templateCounters
			})
			.then();
	}

	private getTemplateCounterDocName(templateSetName: string): string {
		return templateSetName ? templateSetName : 'templates-counter';
	}
}
