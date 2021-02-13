import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Reactive } from '../../client/common/reactive';
import { Router } from '@angular/router';
import { RouteNames } from '../../route-names';

@Injectable()
export class AuthenticationService extends Reactive {

	private readonly loggedIn$ = new ReplaySubject<boolean>(1);

	constructor(private readonly router: Router) {
		super();
		this.onLoggedIn()
			.pipe(this.takeUntil())
			.subscribe((loggedIn: boolean) => {
				switch (loggedIn) {

					case true: {
						this.router.navigate([RouteNames.CLIENT]);
						break;
					}

					default: {
						this.router.navigate([RouteNames.ENTRY]);
					}
				}
			});
	}

	onLoggedIn(): Observable<boolean> {
		return this.loggedIn$.asObservable();
	}

	next(loggedIn: boolean): void {
		this.loggedIn$.next(loggedIn);
	}

}
