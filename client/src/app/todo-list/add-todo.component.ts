import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {Todo} from './todo';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";

@Component({
  selector: 'add-todo.component',
  templateUrl: 'add-todo.component.html',
})
export class AddTodoComponent implements OnInit {

  addTodoForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo }, private fb: FormBuilder) {
  }

  add_todo_validation_messages = {
    'owner': [
      {type: 'required', message: 'A todo must have an owner'},
      {type: 'minlength', message: 'Owner must be at least 2 characters long'},
      {type: 'maxlength', message: 'Owner cannot be more than 25 characters long'},
      {type: 'pattern', message: 'Owner must contain only numbers and letters'}
    ],

    'body': [
      {type: 'maxlength', message: 'Please describe your todo in 250 characters or less'},
      {type: 'required', message: 'Age is required'}
    ],

    'category': [
      {type: 'maxLength', message: 'Please enter a category in 20 characters or less'},
      {type: 'pattern', message: 'Category must contain only numbers and letters'}
    ]
  };

  createForms() {

    // add todo form validations
    this.addTodoForm = this.fb.group({
      // We allow alphanumeric input and limit the length for owner.
      owner: new FormControl('owner', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(25),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ])),

      // The body is required and must not exceed a 250 character count to ensure some concision in todo description.
      body: new FormControl('body', Validators.compose([
        Validators.required,
        Validators.maxLength(250)
      ])),

      // Category is optional, should contain only alphanumeric characters, and should be no longer than 20 characters
      category: new FormControl('category', Validators.compose([
        Validators.maxLength(20),
        Validators.pattern('^[A-Za-z0-9\\s]+[A-Za-z0-9\\s]+$(\\.0-9+)?')
      ]))
    })

  }

  ngOnInit() {
    this.createForms();
  }

}
