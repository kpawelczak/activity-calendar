import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../common/reactive';
import { FirebaseProfileService } from '../firebase/profile/firebase-profile.service';

@Component({
	template: `
		<ng-container *ngIf="profileLoaded">

			<ac-header></ac-header>

			<act-calendar></act-calendar>

			<act-selected-day></act-selected-day>

		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientRootComponent extends Reactive implements OnInit {

	profileLoaded: boolean = false;

	constructor(private readonly firebaseProfileService: FirebaseProfileService,
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
