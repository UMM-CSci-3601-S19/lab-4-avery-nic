import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {TodoListComponent} from './todo-list.component';
import {TodoListService } from "./todo-list.service";
import {Todo} from "./todo";
import {Observable} from 'rxjs/Observable';

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import {CustomModule} from "../custom.module";
import {MATERIAL_COMPATIBILITY_MODE} from "@angular/material";

describe('TodoListComponent', () => {

  let todoList: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;

  let todoListServiceStub: {
    getTodos: () => Observable<Todo[]>
  };

  beforeEach(() => {
// stub UserService for test purposes
    todoListServiceStub = {
      getTodos: () => Observable.of([
        {
          _id: 'chris_todo_id',
          owner: 'Chris',
          body: "This is for Chris",
          status: true,
          category: 'software design'
        },
        {
          _id: 'pat_todo_id',
          owner: 'Pat',
          body: "This is for Pat",
          status: false,
          category: 'groceries'
        },
        {
          _id: 'jamie_todo_id',
          owner: 'Jamie',
          body: "This is for Jamie",
          status: true,
          category: 'video games'
        }
      ])
    };

    TestBed.configureTestingModule({
      imports: [CustomModule],
      declarations: [TodoListComponent],
      providers: [{provide: TodoListService, useValue: todoListServiceStub},
        {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodoListComponent);
      todoList = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it('contains all the todos', () => {
    expect(todoList.todos.length).toBe(3);
  });

  it('', () => {

  });

  it('contains a todo owned by Chris', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Chris')).toBe(true);
  });

  it('contains a todo owned by Pat', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Pat')).toBe(true);
  });

  it('contains a todo owned by Jamie', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'Jamie')).toBe(true);
  });

  it('doesn\'t contain a todo owned by George', () => {
    expect(todoList.todos.some((todo: Todo) => todo.owner === 'George')).toBe(false);
  });

  it('todo list filters by category', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoCategory = 'c';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
  });
  it('todo list filters by body', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoBody = 't';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(3);
    });
  });
  it('todo list filters by status', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoStatus = 'complete';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(2);
    });
  });
  it('todo list filters by category and status', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoStatus = 'complete';
    todoList.todoCategory = 'video games';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
  });
  it('todo list filters by body and status', () => {
    expect(todoList.filteredTodos.length).toBe(3);
    todoList.todoStatus = 'complete';
    todoList.todoBody = 'Chris';
    todoList.refreshTodos().subscribe(() => {
      expect(todoList.filteredTodos.length).toBe(1);
    });
  });
});
