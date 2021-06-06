import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { WeekdayTemplate } from '../store/weekday-template';
import { Weekday } from '../weekday';


@Component({
	selector: 'ac-templates',
	template: `
		<div class="ac-templates-title">
			<h2>Active templates</h2>
		</div>

		<template-settings></template-settings>

		<mat-accordion multi>

			<ac-weekday-template *ngFor="let weekday of getWeekdays()"
								 [weekday]="weekday"></ac-weekday-template>

		</mat-accordion>
	`,
	host: {
		'[class.ac-templates]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent {

	@ViewChild(MatAccordion)
	accordion: MatAccordion;

	weekdayTemplates: Array<WeekdayTemplate>;

	getWeekdays(): Array<Weekday> {
		const weekdays = Object.values(Weekday)
							   .map((value: Weekday) => value)
							   .filter(value => typeof value === 'number');

		weekdays.push(weekdays.shift());

		return weekdays;
	}
}
