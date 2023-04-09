import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/loginService/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private loginService: LoginService, private router: Router) {}

  emailPattern = '';

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(/\S+@\S+\.\S+/)]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9!@#$%^&*]{8,}$/)])
  });

  get email(): any {
    return this.loginForm.get('email');
  }

  get password(): any {
    return this.loginForm.get('password');
  }

  submitLoginForm() {
    if (this.loginForm.valid) {
      this.loginService.loginUser(this.loginForm.value).subscribe(res => {
        console.log(res);
        if (res && res?.token) {
          localStorage.setItem('token', res?.token)
          localStorage.setItem('userType', res?.userType)
          this.router.navigate(["/users"]);
        }
      });
    }
    
  }
}
