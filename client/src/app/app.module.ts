import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {MATERIAL_COMPATIBILITY_MODE} from '@angular/material';


import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {UserComponent} from './users/user.component';
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';
import {TodoListComponent} from "./todo-list/todo-list.component";
import { TodoListService } from "./todo-list/todo-list.service";
import {AddTodoComponent} from "./todo-list/add-todo.component";


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    UserComponent,
    AddUserComponent,
    TodoListComponent,
    AddTodoComponent
  ],
  providers: [
    UserListService,
    TodoListService,
    {provide: APP_BASE_HREF, useValue: '/'},
    {provide: MATERIAL_COMPATIBILITY_MODE, useValue: true}
  ],
  entryComponents: [
    AddUserComponent,
    AddTodoComponent
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
