import {TodoPage} from './todo-list.po';
import {browser, protractor, element, by} from 'protractor';
import {Key} from 'selenium-webdriver';

const origFn = browser.driver.controlFlow().execute;

browser.driver.controlFlow().execute = function () {
  let args = arguments;

  origFn.call(browser.driver.controlFlow(), () => {
    return protractor.promise.delayed(0);
  });

  return origFn.apply(browser.driver.controlFlow(), args);
};

describe('Todo list', () => {
  let page: TodoPage;

  beforeEach(() => {
    page = new TodoPage;
    page.navigateTo();
  });

  it('should get and highlight Todos title attribute', () => {
    expect(page.getTodoTitle()).toEqual('Todos');
  });

  it('should allow us to filter todos based on owner', () => {
    page.getOwner('blanche');
    page.getTodos().then( todos => {
      expect(todos.length).toBe(43);
    });
  });

  it('should allow us to clear a search for owner and then search again', () => {
    page.getOwner('fry');
    page.getTodos().then(todos => {
      expect(todos.length).toBe(61);
    });
    page.click('ownerClearSearch');
    page.getTodos().then(todos => {
      expect(todos.length).toBe(300);
    });
    page.getOwner('blan');
    page.getTodos().then(todos => {
      expect(todos.length).toBe(43);
    });
  });

  it('should allow us to search by owner, update search string, and then search again', () => {
    page.getOwner('a');
    page.getTodos().then(todos => {
      expect(todos.length).toBe(239);
    });
    page.field('todoOwner').sendKeys('nche');
    page.click('submit');
    page.getTodos().then(todos => {
      expect(todos.length).toBe(43);
    })
  });

  it('should allow us to filter by category', () => {
    page.typeInField('todoCategory','software');
    page.getTodos().then(todos => {
      expect(todos.length).toBe(74);
    });
  })
  it('should allow us to filter by body', () => {
    page.typeInField('todoBody','esse');
    page.getTodos().then(todos => {
      expect(todos.length).toBe(74);
    });
  })
  it('should allow us to filter by status', () => {
    page.typeInField('todoStatus','complete');
    page.getTodos().then(todos => {
      expect(todos.length).toBe(143);
    });
  })
});
