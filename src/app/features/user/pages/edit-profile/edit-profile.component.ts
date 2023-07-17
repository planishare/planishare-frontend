import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
    catchError,
    debounceTime,
    filter,
    forkJoin,
    map,
    Observable,
    of,
    skip,
    startWith,
    takeUntil,
    switchMap
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
    public loadingUser = true;
    public loadingInstitutions = false;
    public loadingLocations = true;
    public userVerified = false;
    public saving = false;
    public saved = true;

    public form = new FormGroup({
        email: new FormControl<string>(''),
        firstName: new FormControl<string>('', Validators.minLength(2)),
        lastName: new FormControl<string>('', Validators.minLength(2)),
        education: new FormControl<number|undefined>(undefined),
        institution: new FormControl<number|undefined>(undefined),
        commune: new FormControl<number|undefined>(undefined)
    });

    public userDetail: IUserDetail|null = null;
    public educations: IEducation[] = [];
    public institutions: IInstitution[] = [];
    public regionsWithComunnes: IRegionWithCommunes[] = [];

    public searchInstitution = new FormControl();
    public searchLocation = new FormControl();
    public filteredLocations?: Observable<IRegionWithCommunes[]>;

    public changePasswordMsg = 'Te enviaremos un correo a tu email para que puedas restablecer tu contraseña 📫';

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
        ).subscribe(() => this.saved = false);
    }

    public ngOnInit(): void {
        this.userVerified = this.authService.user?.firebaseUser.emailVerified ?? false;

        const dataRequests = forkJoin([
            this.occupationService.getEducations(),
            this.locationService.getRegionsWithCommunes(),
            this.authService.refreshUserDetail()
        ]);

        dataRequests.pipe(
            catchError(() => {
                this.commonSnackbarMsg.showErrorMessage();
                return of();
            }),
            takeUntil(this.ngUnsubscribe$)
        ).subscribe(([educations, regionsWithComunnes, userDetail]) => {
            // Set educations
            this.educations = educations as IEducation[];

            // Set regions with communes
            this.regionsWithComunnes = regionsWithComunnes as IRegionWithCommunes[];
            this.loadingLocations = false;
            this.filteredLocations = this.searchLocation.valueChanges.pipe(
                startWith(''),
                map(value => this.locationsFilter(value, this.regionsWithComunnes))
            );

            // Set user detail
            this.userDetail = userDetail as IUserDetail;
            this.changePasswordMsg = `Te enviaremos un correo a ${this.userDetail?.email} para que puedas restablecer tu contraseña 📫`;
            this.form.patchValue({
                email: this.userDetail?.email,
                firstName: this.userDetail?.first_name,
                lastName: this.userDetail?.last_name,
                education: this.userDetail?.education?.id,
                institution: this.userDetail?.institution?.id,
                commune: this.userDetail?.commune?.id
            });

            // Set institutions on search
            if (this.userDetail?.institution) {
                this.institutions = [this.userDetail.institution];
            }
            this.searchInstitution.valueChanges.pipe(
                filter(value => value),
                debounceTime(300),
                switchMap(value => {
                    this.loadingInstitutions = true;
                    return this.occupationService.getInstitutions(value);
                }),
                catchError(() => {
                    this.commonSnackbarMsg.showErrorMessage();
                    return of();
                }),
                takeUntil(this.ngUnsubscribe$)
            ).subscribe(institutions => {
                this.institutions = institutions.results;
                this.loadingInstitutions = false;
            });

            // Change status
            this.loadingUser = false;
            this.saved = true;
        });
    }

    public save(event: Event): any {
        event.preventDefault();

        if (this.form.invalid || this.saving) {
            return;
        }

        if (this.saved) {
            this.matSnackBar.open('Perfil actualizado 🙌', 'Cerrar', { duration: 2000 });
            return;
        }

        this.saving = true;
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
                    this.saving = false;
                    return of();
                }),
                takeUntil(this.ngUnsubscribe$)
            )
            .subscribe(newUserDetail => {
                this.matSnackBar.open('Perfil actualizado 🙌', 'Cerrar', { duration: 2000 });
                this.saving = false;
                this.saved = true;

                const userDetail = this.authService.getUserDetail();
                userDetail?.update(newUserDetail);
                this.authService.setUserDetail(userDetail);
            });
    }

    private locationsFilter(
        searchValue: string,
        optionList: IRegionWithCommunes[]): IRegionWithCommunes[] {
        if (!searchValue) {
            return optionList;
        }

        const results: IRegionWithCommunes[] = [];
        searchValue = searchValue.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
    }

    public resendEmail(): void {
        this.firebaseAuthService.sendEmailVerification();
    }

    public resetPassword(): void {
        this.firebaseAuthService.sendPasswordResetEmail(this.userDetail?.email!);
    }
}
