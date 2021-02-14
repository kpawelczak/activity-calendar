import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
	imports: [
		CommonModule,
		MatIconModule,
		MatButtonModule,
		MatMenuModule
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
