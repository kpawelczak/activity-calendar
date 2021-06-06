import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
	selector: 'template-settings',
	template: `
		<mat-form-field appearance="fill">
			<mat-label>Template sets</mat-label>
			<mat-select [formControl]="form">
				<mat-option *ngFor="let topping of templateSets"
							[value]="topping">
					{{topping}}
				</mat-option>
			</mat-select>
		</mat-form-field>
	`,
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateSettingsComponent {
	form = new FormControl();

	templateSets: string[] = ['Template 1', 'Template 2'];
}
