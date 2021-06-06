import { Injectable } from '@angular/core';
import { interval, Observable, of, ReplaySubject } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { ActivityCalendarSnackbarService } from '../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';

@Injectable()
export class ConnectionStatusService {

	private connected: boolean;

	private readonly connectionStatus$ = new ReplaySubject<boolean>(1);

	constructor(private readonly snackBar: ActivityCalendarSnackbarService) {
		this.checkConnectionStatus();

		this.periodicallyCheckConnectionStatus();
	}

	onConnectedStatus(): Observable<boolean> {
		return this.connectionStatus$.asObservable();
	}

	private periodicallyCheckConnectionStatus(): void {
		interval(5000)
			.pipe(
				takeWhile(() => !this.connected),
				switchMap(() => {
					return of(navigator.onLine);
				})
			)
			.subscribe((connected: boolean) => {
				this.connected = connected;
				this.connectionStatus$.next(connected);
				this.noConnectionNotification(connected);
			});
	}

	private noConnectionNotification(connected: boolean): void {
		if (!connected) {
			this.snackBar.notify('no connection, check your network status', { warn: true });
		}
	}

	private checkConnectionStatus(): void {
		const connected = navigator.onLine;

		this.connected = connected;
		this.connectionStatus$.next(connected);
		this.noConnectionNotification(connected);
	}
}
