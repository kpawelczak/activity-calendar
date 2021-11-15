import { Injectable } from '@angular/core';
import { StorageArchive } from '../../../common/cdk/storage-archive';
import { LocalTemplateChanges, LocalTemplates, LocalTemplatesBySetName, LocalWeekdayTemplate } from './local-templates';
import { TemplatesConverter } from './templates.converter';
import { WeekdayTemplate } from '../store/weekday-template';
import { LocalTemplateChangesType } from './local-template-changes-type';
import { TemplateSet } from '../store/sets/template-set';

@Injectable()
export class TemplatesStorage extends StorageArchive<LocalTemplates> {

	private static readonly LOCAL = 'LOCAL';

	private static readonly USER = 'USER';

	getStorageKey(): string {
		return 'ac-templates';
	}

	constructor(private readonly templatesConverter: TemplatesConverter) {
		super();
	}

	getStoredChangesIds(): LocalTemplateChanges | null {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(true))?.changes
			? this.getStoredValue(this.getActivitiesExtendedKey(true)).changes
			: null;
	}

	getStoredTemplates(templateSetName: TemplateSet, loggedIn: boolean): Array<WeekdayTemplate> | null {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.templatesBySetName
			? this.getTemplateBySetName(
				templateSetName,
				this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.templatesBySetName
			)
			: null;
	}

	getStoredTemplateSets(loggedIn: boolean): Array<TemplateSet> | null {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.templateSets
			? this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.templateSets
			: null;
	}

	getStoredActiveTemplate(loggedIn: boolean): TemplateSet | null {
		return !!this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.activeTemplate
			? this.getStoredValue(this.getActivitiesExtendedKey(loggedIn))?.activeTemplate
			: null;
	}

	storeTemplates(templateSet: TemplateSet, templates: Array<WeekdayTemplate>, loggedIn: boolean): void {
		const key = this.getActivitiesExtendedKey(loggedIn);

		let templatesBySetName = this.getStoredValue(key)?.templatesBySetName ? this.getStoredValue(key)?.templatesBySetName : [];

		const templateBySetName = templatesBySetName.find((_templateBySetName) => _templateBySetName.templateSetUUID === templateSet.uuid);

		if (templateBySetName) {
			templatesBySetName = templatesBySetName.map((_templateBySetName: LocalTemplatesBySetName) => {
				return _templateBySetName.templateSetUUID === templateSet.uuid
					? { templateSetUUID: templateSet.uuid, templates } as any
					: _templateBySetName;
			});
		} else {
			templatesBySetName.push({ templateSetUUID: templateSet.uuid, templates } as any);
		}

		const newStoredValues: LocalTemplates = {
			...this.getStoredValue(key),
			templatesBySetName: templatesBySetName
		};
		this.store(newStoredValues, key);
	}

	storeTemplateSet(loggedIn: boolean, templateSets: Array<TemplateSet>): void {
		const key = this.getActivitiesExtendedKey(loggedIn),
			newStoredValues: LocalTemplates = {
				...this.getStoredValue(key),
				templateSets: templateSets
			};
		this.store(newStoredValues, key);
	}

	storeActiveTemplateSet(loggedIn: boolean, templateSet: TemplateSet): void {
		const key = this.getActivitiesExtendedKey(loggedIn),
			newStoredValues: LocalTemplates = {
				...this.getStoredValue(key),
				activeTemplate: templateSet
			};
		this.store(newStoredValues, key);
	}

	updateChangesId(changesId: string, type: LocalTemplateChangesType): void {
		if (changesId) {
			const key = this.getActivitiesExtendedKey(true),
				newStoredValues = {
					...this.getStoredValue(key),
					changes: {
						...this.getChangesIds(changesId, type)
					}
				};
			this.store(newStoredValues, key);
		}
	}

	private getChangesIds(changesId: string, type: LocalTemplateChangesType): LocalTemplateChanges {
		let newChange;

		switch (type) {
			case LocalTemplateChangesType.ACTIVE_TEMPLATE: {
				newChange = { activeTemplateId: changesId };
				break;
			}

			case LocalTemplateChangesType.TEMPLATES: {
				newChange = { templatesId: changesId };
				break;
			}

			case LocalTemplateChangesType.TEMPLATES_SET: {
				newChange = { templateSetsId: changesId };
				break;
			}
		}

		return {
			...this.getStoredChangesIds(),
			...newChange
		};
	}

	private getActivitiesExtendedKey(loggedIn: boolean): string {
		return loggedIn ? TemplatesStorage.USER : TemplatesStorage.LOCAL;
	}

	private transformTemplates(localActivityConfigs: Array<LocalWeekdayTemplate>): Array<WeekdayTemplate> {
		return this.templatesConverter.convertTemplates(localActivityConfigs);
	}

	private getTemplateBySetName(templateSet: TemplateSet,
								 localTemplatesBySetName: Array<LocalTemplatesBySetName>): Array<WeekdayTemplate> {
		const templatesBySetName
			= localTemplatesBySetName
			.find((templateBySetName: LocalTemplatesBySetName) => {
				return templateBySetName.templateSetUUID === templateSet.uuid;
			});

		return templatesBySetName
			? this.transformTemplates(templatesBySetName.templates)
			: null;
	}
}
