import { Component, OnInit } from '@angular/core';
import { UserService } from '../core/user.service';
import { AuthService } from '../core/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import {HttpClient} from "@angular/common/http";

interface Subjects {
  code:string;
  data: {
    name: string,
    semester: number
  }
}

@Component({
  selector: 'page-user',
  templateUrl: 'user.component.html',
  styleUrls: ['user.scss']
})
export class UserComponent implements OnInit{

  apiRoot = 'https://totapp-paualos3.c9users.io';
  //apiRoot = 'https://totapp-isa.herokuapp.com';
  subjectsUrl = `${this.apiRoot}/api/subjects`;

  user: FirebaseUserModel = new FirebaseUserModel();
  profileForm: FormGroup;
  subjects: Subjects[];

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
    this.fetchSubjects();
  }

  fetchSubjects() {
    this.http.get(this.subjectsUrl).subscribe((data:any[]) => {
      console.log("We got", data)
      console.log(data.length)
      this.subjects = data;
      console.log("1st subject", data[0].code, "name", data[0].data.name, "semester", data[0].data.semester)
    })
  };

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
