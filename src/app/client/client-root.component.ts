import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Reactive } from '../common/cdk/reactive';
import { ProfileService } from '../profile/profile.service';


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

	profileLoaded: boolean;

	constructor(private readonly profileService: ProfileService,
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
}
