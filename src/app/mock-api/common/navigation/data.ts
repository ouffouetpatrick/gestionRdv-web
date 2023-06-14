/* tslint:disable:max-line-length */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [

    {
        id   : 'accueil',
        title: 'Accueil',
        type : 'basic',
        icon : 'feather:home',
        link : '/accueil'
    },

    {
        id   : 'visite',
        title: 'Visite',
        type : 'basic',
        icon : 'feather:target',
        link : '/visite'
    },

    {
        id      : 'administration',
        title   : 'Administration',
        type    : 'collapsable',
        icon    : 'mat_solid:admin_panel_settings',
        children: [
            {
                id   : 'utilisateur',
                title: 'Utilisateur',
                type : 'basic',
                icon :'heroicons_outline:user',
                link :'/administration/utilisateur'
            },
            {
                id   : 'profil',
                title: 'Profil',
                type : 'basic',
                icon :'feather:square',
                link : '/administration/profil'
            },
            {
                id   : 'droit',
                title: 'Droit',
                type : 'basic',
                // icon :'feather:square',
                link : '/administration/droit'
            },
            {
                id   : 'module',
                title: 'Module',
                type : 'basic',
                // icon :'feather:square',
                link : '/administration/module'
            }
        ]
    },

    {
        id      : 'parametrage',
        title   : 'Parametrage',
        type    : 'collapsable',
        icon    : 'feather:settings',
        children: [
            {
                id   : 'motif',
                title: 'Motif',
                type : 'basic',
                // icon :'feather:pie-chart',
                link : '/parametrage/motif'
            }
        ]
    },
    {
        id   : 'dashboards',
        title: 'Dashboards',
        type : 'basic',
        icon : 'heroicons_outline:adjustments',
        link : '/dashboards'
    },
    

];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'visite',
        title: 'Visite',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/visite'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'visite',
        title: 'Visite',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/visite'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'visite',
        title: 'Visite',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/visite'
    }
];