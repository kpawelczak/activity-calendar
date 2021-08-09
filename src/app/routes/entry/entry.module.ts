import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntryRootComponent } from './feature/entry-root.component';
import { LoginComponent } from './feature/login/login.component';
import { EntryRoutingModule } from './entry-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from './feature/registration/registration.component';
import { ActivityCalendarButtonModule } from '../../common/ui/activity-calendar-button/activity-calendar-button.module';
import { FirebaseRegistrationService } from './infrastructure/firebase-registration.service';
import { AuthenticationModule } from '../../authentication/authentication.module';


@NgModule({
	imports: [
		CommonModule,
		EntryRoutingModule,
		AuthenticationModule.forFeature(),
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		ActivityCalendarButtonModule
	],
	declarations: [
		EntryRootComponent,
		RegistrationComponent,
		LoginComponent
	],
	providers: [
		FirebaseRegistrationService
	]
})
export class EntryModule {

}
