import { Reactive } from '../../common/cdk/reactive';
import { ProfileService } from './profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';


export abstract class ProfileCollection extends Reactive {

	private profile: string;

	protected constructor(private readonly profileService: ProfileService,
						  private readonly angularFirestore: AngularFirestore) {
		super();
		this.profileService
			.onProfile()
			.pipe(this.takeUntil())
			.subscribe((profile: string) => {
				this.profile = profile;
			});
	}

	protected profileCollection(): AngularFirestoreCollection {
		return this.firestore()
				   .collection(this.profile);
	}

	protected firestore(): AngularFirestore {
		return this.angularFirestore;
	}
}
