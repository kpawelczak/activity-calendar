import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryRootComponent } from './entry-root.component';
import { LoginComponent } from './login/login.component';
import { EntryRoutingModule } from './entry-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';


@NgModule({
	imports: [
		CommonModule,
		EntryRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule
	],
	declarations: [
		EntryRootComponent,
		RegistrationComponent,
		LoginComponent
	]
})
export class EntryModule {

}
