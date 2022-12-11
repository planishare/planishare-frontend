import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    catchError,
    debounceTime,
    forkJoin,
    map,
    Observable,
    of,
    skip,
    startWith,
    takeUntil,
    tap
} from 'rxjs';
import { Unsubscriber } from 'src/app/shared/utils/unsubscriber';

import { FirebaseAuthService } from 'src/app/core/services/firebase-auth.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { LocationsService } from 'src/app/features/user/services/locations.service';
import { OccupationsService } from 'src/app/features/user/services/occupations.service';
import { UsersService } from 'src/app/features/user/services/users.service';
import { CommonSnackbarMsgService } from 'src/app/shared/services/common-snackbar-msg.service';

import { IUserDetail, IUserForm } from 'src/app/features/user/models/user.model';
import { ICommune, IRegionWithCommunes } from 'src/app/features/user/models/location.model';
import { IEducation, IInstitution } from '../../models/institution.model';

import { inOutLeftAnimation, inOutRightAnimation } from 'src/app/shared/animations/animations';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    styleUrls: ['./edit-profile.component.scss'],
    animations: [inOutRightAnimation, inOutLeftAnimation]
})
export class EditProfileComponent extends Unsubscriber implements OnInit {
    public userDetail?: IUserDetail;
    public isUserDataLoading = true;

    public form = new FormGroup({
        email: new FormControl<string>(''),
        firstName: new FormControl<string>('', Validators.minLength(2)),
        lastName: new FormControl<string>('', Validators.minLength(2)),
        education: new FormControl<number | undefined>(undefined),
        institution: new FormControl<number | undefined>(undefined),
        commune: new FormControl<number | undefined>(undefined)
    });

    public isVerificated = false;
    public isLoading = false;
    public alreadySaved = true;

    public educations: IEducation[] = [];
    public institutions: IInstitution[] = [];
    public regionsWithComunnes?: IRegionWithCommunes[];

    public isInstitutionsLoading = false;
    public firstInstitutionReq = true;
    public isLocationsLoading = true;
    public searchInstitution = new FormControl();
    public searchLocation = new FormControl();
    public filteredInstitutions?: Observable<IInstitution[]>;
    public filteredLocations?: Observable<IRegionWithCommunes[]>;

    public changePasswordMsg = 'Te enviaremos un correo al email asociado a tu cuenta para que puedas restablecer tu contraseña 📫';

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
        this.form.controls.email.disable();
        this.form.valueChanges.pipe(
            debounceTime(300),
            skip(1)
        ).subscribe(() => this.alreadySaved = false);
    }

    public ngOnInit(): void {
        this.isVerificated = this.authService.isAuth$.getValue()?.emailVerified ?? false;

        forkJoin([this.getEducations(), this.getRegionsWithCommunes(), this.getUserProfile()])
            .pipe(
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                }),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe(() => {
                this.form.patchValue({
                    email: this.userDetail?.email,
                    firstName: this.userDetail?.first_name,
                    lastName: this.userDetail?.last_name,
                    education: this.userDetail?.education?.id,
                    institution: this.userDetail?.institution?.id,
                    commune: this.userDetail?.commune?.id
                });

                // Filter institutions on input change
                this.searchInstitution.valueChanges.pipe(
                    startWith(''),
                    takeUntil(this.ngUnsubscribe$)
                ).subscribe(value => {
                    if (!!this.userDetail?.institution && this.firstInstitutionReq) {
                        this.firstInstitutionReq = false;
                        this.filteredInstitutions = of([this.userDetail.institution]);
                    } else if (!!value) {
                        this.filteredInstitutions = this.getInstitutions(value);
                    }
                });

                this.isUserDataLoading = false;
                this.alreadySaved = true;
            });
    }

    public save(event: Event): any {
        event.preventDefault();

        if (this.form.invalid || this.isLoading) {
            return;
        }

        if (this.alreadySaved) {
            this.matSnackBar.open('Perfil actualizado 🙌', 'Cerrar', { duration: 2000 });
            return;
        }

        this.isLoading = true;
        const userData: IUserForm = {
            first_name: this.form.controls.firstName.value ?? undefined,
            last_name: this.form.controls.lastName.value ?? undefined,
            education: this.form.controls.education.value ?? undefined,
            institution: this.form.controls.institution.value ?? undefined,
            commune: this.form.controls.commune.value ?? undefined
        };
        this.userServices.updateUserProfile(this.userDetail!.id, userData)
            .pipe(
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    this.isLoading = false;
                    return of();
                }),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe(newUserDetail => {
                this.matSnackBar.open('Perfil actualizado 🙌', 'Cerrar', { duration: 2000 });
                this.isLoading = false;
                this.alreadySaved = true;

                const userDetail = this.authService.getUserDetail();
                userDetail?.update(newUserDetail);
                this.authService.setUserDetail(userDetail);
            });
    }

    public getEducations(): Observable<IEducation[]> {
        return this.occupationService.getEducations().pipe(
            tap(resp => this.educations = resp)
        );
    }

    public getInstitutions(search: string): Observable<IInstitution[]> {
        this.isInstitutionsLoading = true;
        return this.occupationService.getInstitutions(search).pipe(
            map(resp => {
                this.institutions = resp.results;
                this.isInstitutionsLoading = false;
                return resp.results;
            }),
            catchError(() => {
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            }),
            takeUntil(this.ngUnsubscribe$)
        );
    }

    public getRegionsWithCommunes(): Observable<IRegionWithCommunes[]> {
        return this.locationService.getRegionsWithCommunes().pipe(
            tap(resp => {
                this.regionsWithComunnes = resp;
                this.isLocationsLoading = false;
                this.filteredLocations = this.searchLocation.valueChanges.pipe(
                    startWith(''),
                    map(value => this.locationsFilter(value, resp))
                );
            })
        );
    }

    public getUserProfile(): Observable<IUserDetail | undefined> {
        return this.authService.refreshUserDetail().pipe(
            tap(resp => {
                this.userDetail = resp;
                this.changePasswordMsg = `Te enviaremos un correo a ${resp?.email} para que puedas restablecer tu contraseña 📫`;
            })
        );
    }

    private locationsFilter(
        searchValue: string,
        optionList: IRegionWithCommunes[]): IRegionWithCommunes[] {
        if (!!searchValue) {
            searchValue = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const results: IRegionWithCommunes[] = [];
            optionList.forEach(region => {
                const communesFiltered: ICommune[] = [];
                region.communes.forEach(commune => {
                    const communeNameNormalized = commune.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    if (communeNameNormalized.includes(searchValue)) {
                        communesFiltered.push(commune);
                    }
                });
                if (communesFiltered.length) {
                    results.push({
                        ...region,
                        communes: communesFiltered
                    });
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
        this.firebaseAuthService.sendPasswordResetEmail(this.userDetail?.email!);
    }
}
