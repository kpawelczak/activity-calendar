import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { interval, Observable, of, ReplaySubject } from 'rxjs';
import { switchMap, takeWhile } from 'rxjs/operators';
import { ActivityCalendarSnackbarService } from '../../../common/ui/activity-calendar-snackbar/activity-calendar-snackbar.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class ConnectionStatusService {

	private connected: boolean;

	private readonly connectionStatus$ = new ReplaySubject<boolean>(1);

	constructor(@Inject(PLATFORM_ID) private platformId: any,
				private readonly snackBar: ActivityCalendarSnackbarService) {
		this.checkConnectionStatus();

		this.periodicallyCheckConnectionStatus();
	}

	onConnectedStatus(): Observable<boolean> {
		return this.connectionStatus$.asObservable();
	}

	private periodicallyCheckConnectionStatus(): void {
		if (isPlatformBrowser(this.platformId)) {
			interval(10000)
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
	}

	private noConnectionNotification(connected: boolean): void {
		if (!connected) {
			this.snackBar.notify('no connection, check your network status', { warn: true });
		}
	}

	private checkConnectionStatus(): void {
		if (isPlatformBrowser(this.platformId)) {
			const connected = navigator.onLine;

			this.connected = connected;
			this.connectionStatus$.next(connected);
			this.noConnectionNotification(connected);
		}
	}
}
