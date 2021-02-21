import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { Reactive } from '../../../common/reactive';
import { Router } from '@angular/router';
import { RouteName } from '../../../route-name';

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
						this.router.navigate([RouteName.CLIENT]);
						break;
					}

					default: {
						this.router.navigate([RouteName.ENTRY]);
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
