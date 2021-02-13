import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FirebaseAuthenticationService } from '../firebase/entry/firebase-authentication.service';
import { Reactive } from '../common/reactive';
import { FirebaseProfileService } from '../firebase/profile/firebase-profile.service';

@Component({
	template: `
		<ng-container *ngIf="profileLoaded">

			<act-calendar></act-calendar>

			<act-selected-day></act-selected-day>

			<button mat-raised-button color="primary" (click)="logout()">logout</button>

		</ng-container>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientRootComponent extends Reactive implements OnInit {

	profileLoaded: boolean = false;

	constructor(private readonly authService: FirebaseAuthenticationService,
				private readonly firebaseProfileService: FirebaseProfileService,
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

	logout() {
		this.authService.logout();
	}
}
