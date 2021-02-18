import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'ac-templates',
	template: `
		<mat-accordion multi>

			<mat-expansion-panel>

				<mat-expansion-panel-header>
					<mat-panel-title>
						Monday
					</mat-panel-title>
				</mat-expansion-panel-header>

			</mat-expansion-panel>

			<mat-expansion-panel>

				<mat-expansion-panel-header>
					<mat-panel-title>
						Tuesday
					</mat-panel-title>
				</mat-expansion-panel-header>

			</mat-expansion-panel>


		</mat-accordion>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent {

}
