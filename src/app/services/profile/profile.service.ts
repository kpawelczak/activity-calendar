import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class ProfileService {

	private readonly profile$ = new ReplaySubject<string>(1);

	onProfile(): Observable<string> {
		return this.profile$.asObservable();
	}

	next(profile: string): void {
		this.profile$.next(profile);
	}

}
