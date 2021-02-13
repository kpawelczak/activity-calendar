import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { RouteNames } from '../../route-names';


@Injectable()
export class AuthenticationGuard implements CanActivate {

	constructor(public authenticationService: AuthenticationService,
				public router: Router) {
	}

	canActivate(): Observable<boolean> {

		return this.authenticationService.onLoggedIn()
				   .pipe(
					   tap((activated) => {
						   if (!activated) {
							   this.router.navigate([RouteNames.ENTRY]);
						   }
					   })
				   );
	}
}
