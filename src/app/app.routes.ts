import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { RouteName } from './route-name';
import { AuthenticationGuard } from './firebase/authentication/authentication.guard';

const routerConfig: ExtraOptions = { relativeLinkResolution: 'legacy' };

const routes: Routes = [
	{ path: '', redirectTo: `/${RouteName.ENTRY}`, pathMatch: 'full' },
	{
		path: RouteName.ENTRY,
		loadChildren: () => import('./entry/entry.module').then(m => m.EntryModule)
	},
	{
		path: RouteName.CLIENT,
		loadChildren: () => import('./client/client.module').then(m => m.ClientModule),
		canActivate: [AuthenticationGuard]
	},
	{ path: '**', redirectTo: RouteName.ENTRY, pathMatch: 'full' }
];

export const AppRoutes = RouterModule.forRoot(routes, routerConfig);
