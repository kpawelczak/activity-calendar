import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';


@Injectable()
export class FirebaseTemplateSetsService extends ProfileCollection {

	constructor(profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

	getTemplateSets(): Observable<any> {
		return this.profileCollection()
				   .doc('templates')
				   .collection('template-sets')
				   .valueChanges()
				   .pipe(take(1));
	}

}
