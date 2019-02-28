import { Component, OnInit } from '@angular/core';
import {Todo} from "./todo";

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  public todos: Todo[];

  constructor() { }

  ngOnInit() {
  }

}
