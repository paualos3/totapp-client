import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseUserModel } from '../core/user.model';
import {HttpClient} from "@angular/common/http";

interface Files {
  code:string;
  data: {
    name: string,
    url: string,
    subject: string
  }
}

@Component({
  selector: 'page-subject',
  templateUrl: 'subject.component.html',
  styleUrls: ['subject.scss']
})
export class SubjectComponent implements OnInit{

  apiRoot = 'https://totapp-paualos3.c9users.io';
  //apiRoot = 'https://totapp-isa.herokuapp.com';
  subjectsUrl = `${this.apiRoot}/api/files`;

  user: FirebaseUserModel = new FirebaseUserModel();
  files: Files[];

  constructor(
    private route: ActivatedRoute,
    private location : Location,
    private fb: FormBuilder,
    private http:HttpClient
  ) {

  }

  ngOnInit(): void {
    this.fetchFiles();
  }

  fetchFiles() {
    console.log(this.route.snapshot.url); // array of states
    console.log(this.route.snapshot.url[0].path);
    this.http.get(this.subjectsUrl).subscribe((data:any[]) => {
      console.log("We got", data)
      console.log(data.length)
      this.files = data;
    })
  };
}
