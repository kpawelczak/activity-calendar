import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityCalendarLoadingScreenComponent } from './activity-calendar-loading-screen.component';

@Injectable()
export class ActivityCalendarLoadingScreenService {

	constructor(private readonly matDialog: MatDialog) {
	}

	setLoading(loading: boolean, text?: string): void {
		loading ? this.showLoadingBlanket(text) : this.matDialog.closeAll();
	}

	private showLoadingBlanket(text: string): void {
		this.matDialog
			.open(ActivityCalendarLoadingScreenComponent, {
				panelClass: 'activity-calendar-dialog-loading-screen',
				data: {
					text
				},
				disableClose: true
			});
	}
}
