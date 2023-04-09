import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/loginService/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  submitted: boolean | undefined;
  constructor(private loginService: LoginService, private router: Router) { }

  registerForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    // lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*]{8,}$/)]),
    // phoneNumber: new FormControl('', [Validators.required]),\
    userType: new FormControl('', [Validators.required])
  });

  get fullName(): any {
    return this.registerForm.get('fullName');
  }

  // get lastName(): any {
  //   return this.registerForm.get('lastName');
  // }

  get password(): any {
    return this.registerForm.get('password');
  }

  get email(): any {
    return this.registerForm.get('email');
  }

  get userType(): any {
    return this.registerForm.get('userType');
  }

  // get phoneNumber(): any {
  //   return this.registerForm.get('phoneNumber');
  // }

  submitRegisterForm() {
    this.submitted = true;
    if(this.registerForm.valid){
        this.loginService.registerUser(this.registerForm.value).subscribe((res:any) => {
          if (res && res?.token) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('userType', res.userType);
            this.router.navigate(["/users"]);
          }
        }, (err) => {
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: err.error.error,
            showConfirmButton: false,
            timer: 1500
          })
        })
      }
  }
}
