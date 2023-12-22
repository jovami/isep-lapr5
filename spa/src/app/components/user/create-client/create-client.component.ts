import { Component, EventEmitter, Output } from '@angular/core'
import { FormBuilder, UntypedFormGroup, Validators } from '@angular/forms'

import {UserService} from "../../../services/user.Service";
import {ClientDTO} from "../../../dto/ClientDTO";

@Component({
    selector: 'app-create-client',
    templateUrl: './create-client.component.html',
    styleUrls: ['./create-client.component.css'],
})
export class CreateClientComponent {
    form: UntypedFormGroup


    constructor(
        private fb: FormBuilder,
        private service: UserService,
    ) {
        this.form = this.fb.group({
            name: [null, Validators.required],
            email: [null, Validators.required],
            phoneNumber: [null, Validators.required],
            vatNumber: [null, Validators.required],
            password: [null, Validators.required],
        })
    }
    submit() {
        if (this.form.valid) {
            const dto: ClientDTO = {
                name: this.form.value.name,
                email: this.form.value.email,
                phoneNumber: this.form.value.phoneNumber,
                vatNumber: this.form.value.vatNumber,
                password: this.form.value.password,
            }

            this.service.createClient(dto).subscribe({
                next: (client) => {
                    alert(
                        `Created Client: \nName: ${client.name}\nEmail: ${client.email}\nPhoneNumber: ${client.phoneNumber}\nVatNumber: ${client.vatNumber}`
                    )
                    this.form.reset()
                },
                error: (error) => alert(JSON.stringify(error)),
            })
        }
    }
}
