import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivityConfigDialogComponent } from './activity-config-dialog/activity-config-dialog.component';
import { ActivityConfig } from '../store/activity-config';

@Component({
	selector: 'ac-activities-config',
	template: `
		<h2 class="ac-title">Activities configuration</h2>

		<ac-defined-activities-list (onDefinedActivitySelection)="openActivityConfigDialog($event)">
		</ac-defined-activities-list>

		<div class="add-button-wrapper">
			<button mat-icon-button
					[type]="'button'"
					[disableRipple]="true"
					(click)="openActivityConfigDialog()">
				<mat-icon>add_circle</mat-icon>
			</button>
		</div>
	`,
	host: {
		'[class.ac-card]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActivitiesConfigComponent {

	constructor(private readonly matDialog: MatDialog) {
	}

	openActivityConfigDialog(activityConfig?: ActivityConfig): void {
		this.matDialog
			.open(ActivityConfigDialogComponent, {
				panelClass: 'activity-calendar-dialog',
				data: activityConfig
			});
	}
}
