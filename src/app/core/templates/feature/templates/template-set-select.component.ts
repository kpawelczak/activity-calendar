import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TemplateSetsRepository } from '../../store/sets/template-sets.repository';
import { Reactive } from '../../../../common/cdk/reactive';
import { ActiveTemplateSetService } from '../../store/sets/active-template-set.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { TemplatesService } from '../../store/templates/templates.service';
import { TemplateSet } from '../../store/sets/template-set';


@Component({
	selector: 'template-select',
	template: `
		<mat-form-field appearance="fill">
			<mat-label>Template set</mat-label>
			<mat-select [formControl]="form">
				<mat-option *ngFor="let templateSet of templateSets"
							[value]="templateSet.name"
							(click)="selectTemplateSet(templateSet)">
					{{templateSet.name}}
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

	templateSets: Array<TemplateSet>;

	constructor(private readonly templateSetsRepository: TemplateSetsRepository,
				private readonly templatesService: TemplatesService,
				private readonly activeTemplateSetService: ActiveTemplateSetService,
				private readonly changeDetectorRef: ChangeDetectorRef) {
		super();
	}

	ngOnInit() {
		this.templateSetsRepository
			.onValues()
			.pipe(this.takeUntil())
			.subscribe((templateSets: Array<TemplateSet>) => {
				this.templateSets = templateSets;
				this.changeDetectorRef.detectChanges();
			});

		this.activeTemplateSetService
			.onValues()
			.pipe(
				distinctUntilChanged(),
				this.takeUntil())
			.subscribe((templateSet: TemplateSet) => {
				this.form.setValue(templateSet.name);
				this.changeDetectorRef.detectChanges();
			});
	}

	selectTemplateSet(templateSet: TemplateSet): void {
		this.activeTemplateSetService.selectTemplateSet(templateSet);
		this.templatesService.loadTemplates(templateSet);
	}

}
