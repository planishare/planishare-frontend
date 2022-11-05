import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, filter, forkJoin, map, Observable, of, startWith, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';
import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { LocationsService } from 'src/app/core/services/locations.service';
import { OccupationsService } from 'src/app/core/services/occupations.service';
import { UsersService } from 'src/app/core/services/users.service';
import { Commune, RegionWithCommunes } from 'src/app/core/types/location.type';
import { Education, Institution, InstitutionPageable, UserDetail, UserForm } from 'src/app/core/types/users.type';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent extends Unsubscriber implements OnInit {
    public userProfile?: UserDetail;
    public isVerificated?: boolean;
    public form: FormGroup;
    public isSaving = false;
    public isLoading = true;
    public isAlreadySaved = true;

    public educations: Education[] = [];
    public institutions?: Institution[];
    public regionsWithComunnes?: RegionWithCommunes[];

    public isInstitutionsLoading = false;
    public isGetInstitutionsFirstReq = true;
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
        private matSnackBar: MatSnackBar,
        private firebaseAuthService: FirebaseAuthService
    ) {
        super();
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
        this.form.valueChanges.subscribe(() => this.isAlreadySaved = false);
    }

    public ngOnInit(): void {
        this.isVerificated = this.authService.isAuth$.value?.emailVerified;

        this.filteredInstitutions = this.searchInstitution.valueChanges.pipe(
            filter(value => !!value),
            tap(() => this.isInstitutionsLoading = true),
            startWith(''),
            switchMap((value: string) => this.getInstitutions(value))
        );

        forkJoin([this.getEducations(), this.getRegionsWithCommunes(), this.getUserProfile()])
            .pipe(
                takeUntil(this.ngUnsubscribe$),
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
                    education: this.userProfile?.education?.id,
                    institution: this.userProfile?.institution?.id,
                    commune: this.userProfile?.commune?.id
                });
                this.isLoading = false;
                this.isAlreadySaved = true;
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

            this.isSaving = true;
            this.userServices.updateUserProfile(this.userProfile!.id, body)
                .pipe(
                    catchError(error => {
                        this.commonSnackbarMsg.showErrorMessage();
                        return of();
                    })
                )
                .subscribe(resp => {
                    this.matSnackBar.open('Datos actualizados :)', 'Cerrar', { duration: 2000 });
                    this.isSaving = false;
                    this.isAlreadySaved = true;
                    this.form.setErrors({});

                    const currentUserProfile = this.authService.userDetail;
                    this.authService.userDetail = {
                        ...currentUserProfile,
                        ...resp
                    };
                });
        }
    }

    public getEducations(): Observable<Education[]> {
        return this.occupationService.getEducations().pipe(
            tap(resp => this.educations = resp)
        );
    }

    public getInstitutions(search: string): Observable<Institution[]> {
        return this.occupationService.getInstitutions(search).pipe(
            catchError(error => {
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            }),
            tap(resp => {
                this.institutions = resp.results;
                if (!!this.userProfile?.institution && this.isGetInstitutionsFirstReq) {
                    this.institutions?.unshift(this.userProfile?.institution);
                }
                this.isGetInstitutionsFirstReq = false;
                this.isInstitutionsLoading = false;
            }),
            map(data => data.results)
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

    public getUserProfile(): Observable<UserDetail | undefined> {
        return this.authService.reloadUserProfile().pipe(
            tap(resp => this.userProfile = resp)
        );
    }

    private locationsFilter(
        searchValue: string,
        optionList: RegionWithCommunes[]): RegionWithCommunes[] {
        if (!!searchValue) {
            searchValue = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const results: RegionWithCommunes[] = [];
            optionList.forEach(region => {
                const communesFiltered: Commune[] = [];
                region.communes.forEach(commune => {
                    const communeNameNormalized = commune.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (communeNameNormalized.includes(searchValue)) {
                        communesFiltered.push(commune);
                    }
                });
                if (communesFiltered.length) {
                    results.push(
                        { ...region, communes: communesFiltered }
                    );
                }
            });
            return results;
        } else {
            return optionList;
        }
    }

    public resendEmail(): void {
        this.firebaseAuthService.sendEmailVerification();
    }

    public resetPassword(): void {
        this.firebaseAuthService.sendPasswordResetEmail(this.userProfile?.email!);
    }
}
