import { Route } from '@angular/router';
import { DashboardsComponent } from 'app/modules/admin/dashboards/dashboards.component';

export const dashboardsRoutes: Route[] = [
    {
        path: '',
        component: DashboardsComponent,
    },
];
