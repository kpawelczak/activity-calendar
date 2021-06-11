import { TestBed } from '@angular/core/testing';
import { ActivitiesRepository } from '../../app/activities/store/activities/activities.repository';
import { ActivitiesModule } from '../../app/activities/activities.module';
import { CalendarActivity } from '../../app/activities/store/activities/calendar-activity';
import { ProfileModule } from '../../app/profile/profile.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';

describe('ActivitiesRepository -', () => {

	const testActivities: Array<any> = [
		new CalendarActivity(1, 'test', 'test'),
		new CalendarActivity(2, 'test', 'test')
	];

	let activitiesRepository: ActivitiesRepository;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				ActivitiesModule.forRoot(),
				ProfileModule,
				AngularFireModule.initializeApp(environment.firebase),
				AngularFirestoreModule
			]
		});
		activitiesRepository = TestBed.inject(ActivitiesRepository);
	});

	it('should get activities', (done) => {

		// given

		// when
		activitiesRepository.next(testActivities);

		// then
		activitiesRepository
			.onValues()
			.subscribe((activities: Array<CalendarActivity>) => {

				expect(testActivities).toBe(activities);
				done();
			});
	});
});
