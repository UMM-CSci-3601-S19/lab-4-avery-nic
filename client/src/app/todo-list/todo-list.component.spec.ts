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
          body: "This is Chris's todo",
          status: true,
          category: 'software design'
        },
        {
          _id: 'pat_todo_id',
          owner: 'Pat',
          body: "This is Pat's todo",
          status: false,
          category: 'groceries'
        },
        {
          _id: 'jamie_todo_id',
          owner: 'Jamie',
          body: "This is Jamie's todo",
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
});
