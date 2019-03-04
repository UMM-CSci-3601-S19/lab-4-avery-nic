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
  public filteredTodos: Todo[];

  public todoOwner: string;
  public todoCategory: string;
  public todoBody: string;

  constructor(public todoListService: TodoListService) {

  }

  public filterTodos(searchCategory: string, searchBody: string): Todo[]{

    this.filteredTodos = this.todos;

    // Filter by category
    if (searchCategory != null) {
      searchCategory = searchCategory.toLocaleLowerCase();

      this.filteredTodos = this.filteredTodos.filter(todo => {
        return !searchCategory || todo.category.toLocaleLowerCase().indexOf(searchCategory) !== -1;
      });
    }
    // Filter by body
    if (searchBody != null) {
      searchBody = searchBody.toLocaleLowerCase();

      this.filteredTodos = this.filteredTodos.filter(todo => {
        return !searchBody || todo.body.toLocaleLowerCase().indexOf(searchBody) !== -1;
      });
    }
    return this.filteredTodos;
  }

  refreshTodos(): Observable<Todo[]> {
    const todos: Observable<Todo[]> = this.todoListService.getTodos();
    todos.subscribe(
      todos => {
        this.todos = todos;
        this.filterTodos(this.todoCategory, this.todoBody);
      },
      err => {
        console.log(err);
      });
    return todos;
  }

  loadService(): void {
    this.todoListService.getTodos(this.todoOwner).subscribe(
      todos => {
        this.todos = todos;
        this.filteredTodos = this.todos;
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
