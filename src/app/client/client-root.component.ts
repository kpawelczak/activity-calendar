import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../common/reactive';
import { ProfileService } from '../services/profile/profile.service';

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
export class ClientRootComponent extends Reactive implements OnInit {

	profileLoaded: boolean = false;

	constructor(private readonly firebaseProfileService: ProfileService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.firebaseProfileService
			.onProfile()
			.subscribe((profile) => {
				this.profileLoaded = !!profile;
				this.changeDetectorRef.detectChanges();
			});
	}
}
