import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../common/reactive';
import { ProfileService } from '../services/profile/profile.service';
import { ActivitiesRepository } from '../services/repositories/activities/activities.repository';
import { WeekdayTemplatesRepository } from '../services/repositories/templates/weekday-templates.repository';

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

	constructor(private readonly firebaseProfileService: ProfileService,
				private readonly activitiesRepository: ActivitiesRepository,
				private readonly weekdayTemplatesRepository: WeekdayTemplatesRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.firebaseProfileService
			.onProfile()
			.pipe(this.takeUntil())
			.subscribe((profile: string) => {
				this.profileLoaded = !!profile;
				this.changeDetectorRef.detectChanges();
			});
	}

	ngOnDestroy() {
		super.ngOnDestroy();
		this.activitiesRepository.next([]);
		this.weekdayTemplatesRepository.reset();
	}
}
