import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ActivityCalendarSnackbarService {

	constructor(private readonly matSnackBar: MatSnackBar) {
	}

	notify(message, config?: {
		duration?: number,
		warn?: boolean
	}): void {
		const panelClass = config?.warn ? 'ac-snackbar-warn' : 'ac-snackbar',
			duration = config?.duration ? config.duration : 5000;

		this.matSnackBar.open(message, '', {
			panelClass,
			duration
		});
	}

}
