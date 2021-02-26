import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../common/reactive';
import { ProfileService } from '../services/profile/profile.service';
import { ActivitiesRepository } from '../services/repositories/activities/activities.repository';
import { WeekdayTemplatesRepository } from '../services/repositories/templates/weekday-templates.repository';
import { WeekdayTemplateCountersRepository } from '../services/repositories/templates/counters/weekday-template-counters.repository';
import { FirestoreActivitiesService } from '../services/firebase/activities/activities/firestore-activities.service';
import { ActiveDateService } from './home/calendar/active-date.service';

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
				private readonly firestoreActivitiesService: FirestoreActivitiesService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.profileService
			.onProfile()
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
		this.firestoreActivitiesService.reset();
		this.activeDateService.reset();
	}
}
