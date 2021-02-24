import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { TemplateCounter } from '../../repositories/templates/counters/template-counter';


@Injectable()
export class FirebaseTemplateCountersService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	updateTemplateCounters(templateCounters: TemplateCounter): void {
		this.profileCollection()
			.doc('templates')
			.collection('templates-counter')
			.doc('templates-counter')
			.update({
				...templateCounters
			})
			.then();
	}

	getTemplateCounters(): Observable<TemplateCounter> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('templates-counter')
				   .doc('templates-counter')
				   .valueChanges()
				   .pipe(take(1));
	}
}
