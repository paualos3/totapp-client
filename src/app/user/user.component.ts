import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs/Observable";

interface Subjects {
  name: string;
  semester:string;
  code:string;
}

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})
export class UserComponent implements OnInit{

  //apiRoot = 'https://totapp-paualos3.c9users.io';
  apiRoot = 'https://totapp-isa.herokuapp.com';
  subjectsUrl = `${this.apiRoot}/api/subjects`;
  subjects$: Observable<Subjects[]>;

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;

  constructor(
    public userService: UserService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private location : Location,
    private fb: FormBuilder,
    private http:HttpClient
  ) {

  }

  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.user = data;
        this.createForm(this.user.name);
      }
    })
    this.http.get(this.subjectsUrl).subscribe(data => {
      console.log("We got", data)
    })
    /*this.subjects$ = this.http
      .get<Subjects[]>(this.subjectsUrl)
      .map(data => _.values(data))
      .do(console.log);*/
  }

  createForm(name) {
    this.profileForm = this.fb.group({
      name: [name, Validators.required ]
    });
  }

  save(value){
    this.userService.updateCurrentUser(value)
    .then(res => {
      console.log(res);
    }, err => console.log(err))
  }

  logout(){
    this.authService.doLogout()
    .then((res) => {
      this.location.back();
    }, (error) => {
      console.log("Logout error", error);
    });
  }
}
