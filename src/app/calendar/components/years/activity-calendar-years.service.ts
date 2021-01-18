import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ActivityCalendarYearsService {

	private readonly years$ = new Subject<Array<Array<number>>>();

	onYears(): Observable<Array<Array<number>>> {
		return this.years$.asObservable();
	}

	next(years: Array<Array<number>>): void {
		this.years$.next(years);
	}

}
