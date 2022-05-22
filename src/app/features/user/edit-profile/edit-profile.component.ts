import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, forkJoin, map, Observable, of, startWith, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { OccupationsService } from 'src/app/core/services/occupations.service';
import { RegionWithCommunes } from 'src/app/core/types/location.type';
import { Education, Institution, UserDetail } from 'src/app/core/types/users.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
    public userProfile?: UserDetail;
    public form: FormGroup;

    public educations: Education[] = [];
    public institutions?: Institution[];
    public regionsWithComunnes?: RegionWithCommunes[];

    public isInstitutionsLoading = true;
    public isLocationsLoading = true;
    public searchInstitution: FormControl;
    public searchLocation: FormControl;
    public filteredInstitutions?: Observable<Institution[]>;
    public filteredLocations?: Observable<RegionWithCommunes[]>;

    constructor(
        private authService: AuthService,
        private occupationService: OccupationsService,
        private locationService: LocationsService,
        private commonSnackbarMsg: CommonSnackbarMsgService
    ) {
        this.form = new FormGroup({
            email: new FormControl(null),
            firstName: new FormControl(null),
            lastName: new FormControl(null),
            education: new FormControl(null),
            institution: new FormControl(null),
            commune: new FormControl(null)
        });
        this.searchInstitution = new FormControl();
        this.searchLocation = new FormControl();
    }

    public ngOnInit(): void {
        this.userProfile = this.authService.getUserProfile();
        console.log(this.userProfile);

        forkJoin([this.getEducations(), this.getInstitutions(), this.getRegionsWithCommunes()])
            .pipe(
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(console.log);
    }

    public getEducations(): Observable<Education[]> {
        return this.occupationService.getEducations().pipe(
            tap(resp => this.educations = resp)
        );
    }

    public getInstitutions(): Observable<Institution[]> {
        return this.occupationService.getInstitutions().pipe(
            tap(resp => {
                this.institutions = resp;
                this.isInstitutionsLoading = false;
                this.filteredInstitutions = this.searchInstitution.valueChanges.pipe(
                    startWith(''),
                    map(value => this.namefilter(value, this.institutions!))
                );
            })
        );
    }

    public getRegionsWithCommunes(): Observable<RegionWithCommunes[]> {
        return this.locationService.getRegionsWithCommunes().pipe(
            tap(resp => {
                this.regionsWithComunnes = resp;
                this.isLocationsLoading = false;
                this.filteredLocations = this.searchLocation.valueChanges.pipe(
                    startWith(''),
                    map(value => this.locationsFilter(value, this.regionsWithComunnes!))
                );
            })
        );
    }

    private namefilter(
        searchValue: string,
        optionList: (Institution)[]): (Institution)[] {
        if (!!searchValue) {
            searchValue = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return optionList.filter(el => {
                const textNormalized = el.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return textNormalized.includes(searchValue);
            });
        } else {
            return optionList;
        }
    }

    private locationsFilter(
        searchValue: string,
        optionList: RegionWithCommunes[]): RegionWithCommunes[] {
        if (!!searchValue) {
            searchValue = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return optionList.filter(el => {
                const regionNameNormalized = el.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                const filteredCommunes = el.communes.filter(commune => {
                    const communeNameNormalized = commune.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    return communeNameNormalized.includes(searchValue);
                });

                // TODO_OPT: show filtered communes
                // el.communes = filteredCommunes;

                return regionNameNormalized.includes(searchValue) || !!filteredCommunes.length;
            });
        } else {
            return optionList;
        }
    }
}
