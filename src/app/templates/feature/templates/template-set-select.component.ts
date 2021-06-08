import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TemplateSetsRepository } from '../../store/sets/template-sets.repository';
import { Reactive } from '../../../common/cdk/reactive';
import { ActiveTemplateSetService } from '../../store/sets/active-template-set.service';
import { combineLatest } from 'rxjs';

@Component({
	selector: 'template-select',
	template: `
		<mat-form-field appearance="fill">
			<mat-label>Template set</mat-label>
			<mat-select [formControl]="form">
				<mat-option *ngFor="let templateSetName of templateSets"
							[value]="templateSetName">
					{{templateSetName}}
				</mat-option>
			</mat-select>
		</mat-form-field>
	`,
	host: {
		'[class.template-select]': 'true'
	},
	encapsulation: ViewEncapsulation.None,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateSetSelectComponent extends Reactive implements OnInit {

	form = new FormControl();

	templateSets: string[];

	constructor(private readonly templateSetsRepository: TemplateSetsRepository,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		combineLatest([
			this.templateSetsRepository.onValues(),
			this.activeTemplateSetService.onValues()
		])
			.pipe(
				this.takeUntil()
			)
			.subscribe(([templateSets, activeTemplateName]) => {
				this.templateSets = templateSets;
				this.selectTemplateSet(activeTemplateName);
				this.changeDetectorRef.detectChanges();
			});
	}

	selectTemplateSet(templateSetName: string): void {
		this.form.setValue(templateSetName);
	}
}
