import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { RouterModule } from '@angular/router';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule,
		RouterModule
	],
	declarations: [
		HeaderComponent
	],
	exports: [
		HeaderComponent
	]
})
export class HeaderModule {

}
