import { Injectable } from '@angular/core';
import { ProfileCollection } from '../../profile/profile-collection';
import { ActivityCalendarSnackbarService } from '../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';
import { ProfileService } from '../../profile/profile.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { WeekdayTemplateSetsRepository } from '../store/sets/weekday-template-sets.repository';


@Injectable()
export class FirebaseTemplateSetsService extends ProfileCollection {

	constructor(private readonly templateSetsRepository: WeekdayTemplateSetsRepository,
				private readonly acSnackBar: ActivityCalendarSnackbarService,
				profileService: ProfileService,
				angularFirestore: AngularFirestore) {
		super(profileService, angularFirestore);
	}

}
