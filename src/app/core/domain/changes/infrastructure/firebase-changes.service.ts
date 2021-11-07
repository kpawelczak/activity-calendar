import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import { DomainChanges } from '../domain-changes';
import { DomainChangesType } from '../domain-changes.type';
import DocumentData = firebase.firestore.DocumentData;

@Injectable()
export class FirebaseChangesService extends ProfileCollection {

	constructor(firebaseProfileService: ProfileService,
				firestore: AngularFirestore) {
		super(firebaseProfileService, firestore);
	}

	onChangesIds(): Observable<DomainChanges> {
		return this.profileCollection()
				   .doc('changes')
				   .valueChanges()
				   .pipe(
					   map((documentData: DocumentData) => {
						   return new DomainChanges(
							   documentData?.activities,
							   documentData?.definedActivities,
							   documentData?.units
						   );
					   }),
					   take(1)
				   );
	}

	registerNewChanges(type: DomainChangesType): Observable<string> {
		const changesId = uuidv4();

		return from(
			this.profileCollection()
				.doc('changes')
				.update({ [type]: changesId }))
			.pipe(
				map(() => changesId)
			);
	}
}
