import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, forkJoin, map, Observable, of, startWith, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { OccupationsService } from 'src/app/core/services/occupations.service';
import { UsersService } from 'src/app/core/services/users.service';
import { RegionWithCommunes } from 'src/app/core/types/location.type';
import { Education, Institution, UserDetail, UserForm } from 'src/app/core/types/users.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
    public userProfile?: UserDetail;
    public form: FormGroup;
    public isSaveLoading = false;
    public isLoading = true;

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
        private userServices: UsersService,
        private commonSnackbarMsg: CommonSnackbarMsgService,
        private matSnackBar: MatSnackBar
    ) {
        this.form = new FormGroup({
            email: new FormControl(null),
            firstName: new FormControl(null),
            lastName: new FormControl(null),
            education: new FormControl(null),
            institution: new FormControl(null),
            commune: new FormControl(null)
        });
        this.form.get('email')?.disable();
        this.searchInstitution = new FormControl();
        this.searchLocation = new FormControl();
    }

    public ngOnInit(): void {
        this.userProfile = this.authService.getUserProfile();

        forkJoin([this.getEducations(), this.getInstitutions(), this.getRegionsWithCommunes()])
            .pipe(
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(() => {
                this.form.patchValue({
                    email: this.userProfile?.email,
                    firstName: this.userProfile?.first_name,
                    lastName: this.userProfile?.last_name,
                    education: this.userProfile?.education.id,
                    institution: this.userProfile?.institution.id,
                    commune: this.userProfile?.commune.id
                });
                this.isLoading = false;
            });
    }

    public save(event: Event): any {
        event.preventDefault();
        console.log(this.form);
        if (this.form.valid) {
            const body: UserForm = {
                first_name: this.form.get('firstName')?.value,
                last_name: this.form.get('lastName')?.value,
                education: this.form.get('education')?.value,
                institution: this.form.get('institution')?.value,
                commune: this.form.get('commune')?.value
            };

            this.isSaveLoading = true;
            this.userServices.updateUserProfile(this.userProfile!.id, body)
                .pipe(
                    catchError(error => {
                        this.commonSnackbarMsg.showErrorMessage();
                        return of();
                    })
                )
                .subscribe(resp => {
                    this.matSnackBar.open('Datos actualizados', 'OK', { duration: 2000 });
                    this.isSaveLoading = false;
                    this.form.setErrors({});
                    this.updateUserProfile();
                });
        }
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

    private updateUserProfile(): void {
        this.userServices.getUserProfileByEmail(this.userProfile!.email)
            .pipe(
                catchError(error => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of(null);
                })
            )
            .subscribe(resp => {
                if (!!resp) {
                    this.authService.setUserProfile(resp);
                }
            });
    }
}
