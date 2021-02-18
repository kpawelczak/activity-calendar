import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesComponent } from './templates.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { TemplateFormComponent } from './template-form.component';

@NgModule({
	imports: [
		CommonModule,
		MatFormFieldModule,
		MatInputModule,
		MatExpansionModule
	],
	declarations: [
		TemplatesComponent,
		TemplateFormComponent
	]
})
export class TemplatesModule {

}
