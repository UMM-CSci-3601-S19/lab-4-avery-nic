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
});
