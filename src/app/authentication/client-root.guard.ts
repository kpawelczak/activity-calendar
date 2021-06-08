import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthenticationService } from './authentication.service';
import { RouteName } from '../route-name';


@Injectable()
export class ClientRootGuard implements CanActivate {

	constructor(public authenticationService: AuthenticationService,
				public router: Router) {
	}

	canActivate(): Observable<boolean> {
		return this.authenticationService
				   .onLoggedIn()
				   .pipe(
					   map((activated) => {
						   if (!activated) {
							   this.router.navigate([RouteName.ENTRY]);
						   }
						   return activated;
					   })
				   );
	}
}
