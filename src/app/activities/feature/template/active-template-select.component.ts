import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Weekday } from '../../../templates/weekday';
import { weekdayNames } from '../../../templates/feature/templates/weekdays/weekday-names';
import { SelectedDayActiveTemplateSetRepository } from '../../store/template/selected-day-active-template-set.repository';
import { WeekdayTemplate } from '../../../templates/store/weekday-template';

@Component({
	selector: 'selected-day-active-template-select',
	template: `
		<mat-form-field appearance="fill">
			<mat-label>Weekday template</mat-label>
			<mat-select [formControl]="form">
				<mat-option *ngFor="let weekdayTemplate of filteredWeekdayTemplates"
							[value]="weekdayTemplate.getWeekday()"
							(click)="changeWeekdayTemplate(weekdayTemplate.getWeekday())">
					{{getWeekdayName(weekdayTemplate.getWeekday())}}
				</mat-option>
			</mat-select>
		</mat-form-field>
	`,
	host: {
		'[class.selected-day-active-template-select]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActiveTemplateSelectComponent implements OnChanges {

	@Input()
	activeWeekdayTemplate: number;

	@Input()
	weekdayTemplates: Array<WeekdayTemplate>;

	filteredWeekdayTemplates: Array<WeekdayTemplate>;

	form = new FormControl();

	constructor(private readonly selectedDayActiveTemplateSetRepository: SelectedDayActiveTemplateSetRepository) {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.activeWeekdayTemplate) {
			this.form.setValue(this.activeWeekdayTemplate);
		}

		if (changes.weekdayTemplates) {
			this.setWeekdayTemplates();
		}
	}

	changeWeekdayTemplate(weekday: Weekday): void {
		this.selectedDayActiveTemplateSetRepository.next(weekday);
	}

	getWeekdayName(weekdayTemplate: number): string {
		return weekdayNames[weekdayTemplate].replace(/.$/, '');
	}

	private setWeekdayTemplates(): void {
		if (this.weekdayTemplates) {
			const weekdayTemplates = [...this.weekdayTemplates];
			this.filteredWeekdayTemplates
				= weekdayTemplates
				.filter((weekdayTemplate: WeekdayTemplate) => weekdayTemplate.getTemplateCounter() > 0);
		}
	}
}
