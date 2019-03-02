import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';

import {Todo} from './todo';
import {TodoListService} from './todo-list.service';

describe('Todo list service: ', () => {
  // A small collection of test todos
  const testTodos: Todo[] = [
    {
      _id: 'chris_id',
      owner: 'Chris',
      body: "hello",
      status: true,
      category: 'software design'
    },
    {
      _id: 'pat_id',
      owner: 'Pat',
      body: "hi",
      status: true,
      category: 'groceries'
    },
    {
      _id: 'jamie_id',
      owner: 'Jamie',
      body: "howdy",
      status: false,
      category: 'videogames'
    }
  ];
  const mTodos: Todo[] = testTodos.filter(todo =>
    todo.owner.toLowerCase().indexOf('m') !== -1
  );

  // We will need some url information from the todoListService to meaningfully test owner filtering;
  // https://stackoverflow.com/questions/35987055/how-to-write-unit-testing-for-angular-2-typescript-for-private-methods-with-ja
  let todoListService: TodoListService;
  let currentlyImpossibleToGenerateTodoUrl: string;

  // These are used to mock the HTTP requests so that we (a) don't have to
  // have the server running and (b) we can check exactly which HTTP
  // requests were made to ensure that we're making the correct requests.
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    // Set up the mock handling of the HTTP requests
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    // Construct an instance of the service with the mock
    // HTTP client.
    todoListService = new TodoListService(httpClient);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  it('getTodos() calls api/todos', () => {
    todoListService.getTodos().subscribe(
      todos => expect(todos).toBe(testTodos)
    );

    // Specify that (exactly) one request will be made to the specified URL.
    const req = httpTestingController.expectOne(todoListService.baseUrl);
    // Check that the request made to that URL was a GET request.
    expect(req.request.method).toEqual('GET');
    // Specify the content of the response to that request. This
    // triggers the subscribe above, which leads to that check
    // actually being performed.
    req.flush(testTodos);
  });

  it('getTodos(todoOwner) adds appropriate param string to called URL', () => {
    todoListService.getTodos('m').subscribe(
      todos => expect(todos).toEqual(mTodos)
    );

    const req = httpTestingController.expectOne(todoListService.baseUrl + '?owner=m&');
    expect(req.request.method).toEqual('GET');
    req.flush(mTodos);
  });

  it('filterByOwner(todoOwner) deals appropriately with a URL that already had an owner', () => {
    currentlyImpossibleToGenerateTodoUrl = todoListService.baseUrl + '?owner=f&something=k&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateTodoUrl;
    todoListService.filterByOwner('m');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&owner=m&');
  });

  it('filterByOwner(todoOwner) deals appropriately with a URL that already had some filtering, but no owner', () => {
    currentlyImpossibleToGenerateTodoUrl = todoListService.baseUrl + '?something=k&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateTodoUrl;
    todoListService.filterByOwner('m');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '?something=k&owner=m&');
  });

  it('filterByOwner(todoOwner) deals appropriately with a URL has the keyword owner, but nothing after the =', () => {
    currentlyImpossibleToGenerateTodoUrl = todoListService.baseUrl + '?owner=&';
    todoListService['todoUrl'] = currentlyImpossibleToGenerateTodoUrl;
    todoListService.filterByOwner('');
    expect(todoListService['todoUrl']).toEqual(todoListService.baseUrl + '');
  });

  it('getTodoById() calls api/todos/id', () => {
    const targetTodo: Todo = testTodos[1];
    const targetId: string = targetTodo._id;
    todoListService.getTodoById(targetId).subscribe(
      todo => expect(todo).toBe(targetTodo)
    );

    const expectedUrl: string = todoListService.baseUrl + '/' + targetId;
    const req = httpTestingController.expectOne(expectedUrl);
    expect(req.request.method).toEqual('GET');
    req.flush(targetTodo);
  });
});
