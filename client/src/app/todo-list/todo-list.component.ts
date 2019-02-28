import { Component, OnInit } from '@angular/core';
import {Todo} from "./todo";
import {TodoListService} from "./todo-list.service";
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit {
  public todos: Todo[];

  constructor(public todoListService: TodoListService) { }

  refreshTodos(): Observable<Todo[]> {
    const todos: Observable<Todo[]> = this.todoListService.getTodos();
    todos.subscribe(
      todos => {
        this.todos = todos;
      },
      err => {
        console.log(err);
      }
    );
    return todos;
  }

  loadService(): void {
    this.todoListService.getTodos().subscribe(
      todos => {
        this.todos = todos;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit() {
    this.refreshTodos();
    this.loadService();
  }

}
