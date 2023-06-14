import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation,} from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { ApexOptions } from 'ng-apexcharts';
import { Visite } from 'app/interfaces/visite/visite';
import { VisiteService } from 'app/services/visite/visite.service';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardsService } from 'app/services/dashboards/dashboard.service';

@Component({
    selector: 'project',
    templateUrl: './dashboards.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardsComponent implements OnInit, OnDestroy {
    chartGithubIssues: ApexOptions = {};
    chartTaskDistribution: ApexOptions = {};
    chartBudgetDistribution: ApexOptions = {};
    chartWeeklyExpenses: ApexOptions = {};
    chartMonthlyExpenses: ApexOptions = {};
    chartYearlyExpenses: ApexOptions = {};
    data: any;
    chartEmployeSolicite: ApexOptions;
    chartVisite: ApexOptions;

    displayedColumns: string[] = [
        'dateRdv',
        'heure',
        'objet',
        'datecreation'
    ];
    dataSource = new MatTableDataSource<any>([]);
    showPagination: number = 0;
    isLoading: boolean = false;
    visite: Visite[];
    totalData: any;
    totalDataVisEmploye: any;
    selectedProject: string = 'ACME Corp. Backend App';
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _visiteService: VisiteService,
        private _dashboardsService: DashboardsService,
        private _router: Router
    ) {}
    /**
     * On init
     */
    ngOnInit(): void {
        this.getVisiteAttente();
        this.getTotalVisite();
        this.getTotalVisiteEmploye();

        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                },
            },
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    //Recuperer la liste des visites en attents pour afficher les plus récentes et le nombre dans le tableau
    getVisiteAttente(): void {
        this.isLoading = true; // Démarre le loader

        const getVisite = this._visiteService.getListeVisiteAvecStatut();

        getVisite.subscribe((result) => {
            this.visite = result;

            let element = [];

            result.map((item) => {
                if (item && element.length < 5) {
                    element.push(item);
                }
            });
            // console.log('visiteAdmin', result);
            this.isLoading = false; // stop le loader
            this.dataSource = new MatTableDataSource<any>(element);
            console.log(this.dataSource);

            //  pagination
            // this.pagination.size = 10;
        });
    }

    //Recuperer le total des visites dans le tableau de bord
    getTotalVisite(): void {
        this.isLoading = true; // Démarre le loader
        const getTotal = this._dashboardsService.getTotalVisiteParStatut();
        getTotal.subscribe((result) => {
            this.totalData = result;
            this.isLoading = false; // stop le loader
            console.log(this.totalData);
            this._prepareChartData();
        });
    }

    //Recuperer le total des visites par employe dans le tableau de bord
    getTotalVisiteEmploye(): void {
        this.isLoading = true; // Démarre le loader
        const getTotalVisiteEmploye =
            this._dashboardsService.getTotalVisiteParEmploye();
        getTotalVisiteEmploye.subscribe((result) => {
            this.totalDataVisEmploye = result;
            this.isLoading = false; // stop le loader
            // console.log(this.totalDataVisEmploye);
            this._prepareChartDataEmploye();
        });
    }

    /**
     * Track by function for ngFor loops
     *
     * @param index
     * @param item
     */
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter((el) => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute(
                    'fill',
                    `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`
                );
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */

    private _prepareChartData(): void {
        // visite
        this.chartVisite = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#3b82f6', '#22c55e', '#e83e3e', '#f59e0b'],
            labels: this.totalData.libelle,
            plotOptions: {
                pie: {
                    customScale: 1,
                    expandOnClick: false,
                    donut: {
                        size: '0%',
                    },
                },
            },
            series: this.totalData.valeur,
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}</div>
                                </div>`,
            },
        };
    }

    private _prepareChartDataEmploye(): void {
        // employe
        this.chartEmployeSolicite = {
            chart: {
                animations: {
                    speed: 400,
                    animateGradually: {
                        enabled: false,
                    },
                },
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'donut',
                sparkline: {
                    enabled: true,
                },
            },
            colors: ['#3b82f6', '#22c55e', '#e83e3e', '#f59e0b'],
            labels: this.totalDataVisEmploye.nomEmploye,
            plotOptions: {
                pie: {
                    customScale: 1,
                    expandOnClick: false,
                    donut: {
                        size: '0%',
                    },
                },
            },

            series: this.totalDataVisEmploye.nombreVisiteEmploye,
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            tooltip: {
                enabled: true,
                fillSeriesColor: false,
                theme: 'dark',
                custom: ({
                    seriesIndex,
                    w,
                }): string => `<div class="flex items-center h-8 min-h-8 max-h-8 px-3">
                                    <div class="w-3 h-3 rounded-full" style="background-color: ${w.config.colors[seriesIndex]};"></div>
                                    <div class="ml-2 text-md leading-none">${w.config.labels[seriesIndex]}:</div>
                                    <div class="ml-2 text-md font-bold leading-none">${w.config.series[seriesIndex]}</div>
                                </div>`,
            },
        };
    }
}
