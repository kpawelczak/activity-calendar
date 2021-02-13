import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { RouteNames } from './route-names';
import { AuthenticationGuard } from './firebase/authentication/authentication.guard';

const routerConfig: ExtraOptions = { relativeLinkResolution: 'legacy' };

const routes: Routes = [
	{ path: '', redirectTo: `/${RouteNames.ENTRY}`, pathMatch: 'full' },
	{
		path: RouteNames.ENTRY,
		loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule)
	},
	{
		path: RouteNames.CLIENT,
		loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
		canActivate: [AuthenticationGuard]
	},
	{ path: '**', redirectTo: RouteNames.ENTRY, pathMatch: 'full' }
];

export const AppRoutes = RouterModule.forRoot(routes, routerConfig);
