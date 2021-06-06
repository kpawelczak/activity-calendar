import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../common/cdk/reactive';
import { ProfileService } from '../profile/profile.service';
import { ActivitiesRepository } from '../services/repositories/activities/activities.repository';
import { FirebaseActivitiesService } from '../services/firebase/activities/activities/firebase-activities.service';
import { ActiveDateService } from './home/calendar/active-date.service';
import { ActivitiesCountRepository } from '../services/repositories/activities/count/activities-count.repository';
import { WeekdayTemplatesRepository } from '../templates/store/weekday-templates.repository';
import { WeekdayTemplateCountersRepository } from '../templates/store/counters/weekday-template-counters.repository';

@Component({
	template: `
		<ng-container *ngIf="profileLoaded">

			<ac-header></ac-header>

			<router-outlet></router-outlet>

		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientRootComponent extends Reactive implements OnInit, OnDestroy {

	profileLoaded: boolean = false;

	constructor(private readonly profileService: ProfileService,
				private readonly activeDateService: ActiveDateService,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
				private readonly weekdayTemplateCountersRepository: WeekdayTemplateCountersRepository,
				private readonly firebaseActivitiesService: FirebaseActivitiesService,
				private readonly activitiesCountRepository: ActivitiesCountRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.profileService
			.onValues()
			.pipe(this.takeUntil())
			.subscribe((profile: string) => {
				this.profileLoaded = !!profile;
				this.changeDetectorRef.detectChanges();
			});
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.onLogout();
	}

	private onLogout(): void {
		this.activitiesRepository.reset();
		this.weekdayTemplatesRepository.reset();
		this.weekdayTemplateCountersRepository.reset();
		this.firebaseActivitiesService.reset();
		this.activeDateService.reset();
		this.activitiesCountRepository.reset();
	}
}
