import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { WeekdayTemplate } from '../../store/weekday-template';
import { RouteName } from '../../../route-name';
import { TemplatesRepository } from '../../store/templates/templates.repository';
import { Reactive } from '../../../common/cdk/reactive';


@Component({
	selector: 'ac-templates',
	template: `
		<div class="ac-title">
			<h2>Active templates</h2>
		</div>

		<div class="ac-templates-controller">
			<template-select></template-select>
			<mat-icon [routerLink]="RouteName.TEMPLATES_SETTINGS">settings</mat-icon>
		</div>

		<mat-accordion multi>

			<ac-weekday-template *ngFor="let weekdayTemplate of weekdayTemplates"
								 [weekdayTemplate]="weekdayTemplate"></ac-weekday-template>

		</mat-accordion>
	`,
	host: {
		'[class.ac-templates]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplatesComponent extends Reactive implements OnInit {

	@ViewChild(MatAccordion)
	accordion: MatAccordion;

	weekdayTemplates: Array<WeekdayTemplate>;

	RouteName = RouteName;

	constructor(private readonly templatesRepository: TemplatesRepository,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.templatesRepository
			.onValues()
			.pipe(this.takeUntil())
			.subscribe((weekdayTemplates: Array<WeekdayTemplate>) => {
				this.weekdayTemplates = [...weekdayTemplates];
				this.changeDetectorRef.detectChanges();
			});
	}
}
