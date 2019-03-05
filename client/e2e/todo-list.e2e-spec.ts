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
  });

  it('Should have an add todo button', () => {
    expect(page.elementExistsWithId('addNewTodo')).toBeTruthy();
  });

  it('Should open a dialog box when add user button is clicked', () => {
    expect(page.elementExistsWithCss('add-todo')).toBeFalsy('There should not be a modal window yet');
    page.click('addNewTodo');
    expect(page.elementExistsWithCss('add-todo')).toBeTruthy('There should be a modal window now');
  });

  describe('Add Todo', () => {

    beforeEach(() => {
      page.navigateTo();
      page.click('addNewTodo');
    });

    it('Should actually add the todo with the information we put in the fields', () => {
      // could not write this test since the HTML in todo-list.component.html to add a unique id to every todo is broken.
      // instead of inserting the _id, it inserts "[object Object]". I don't know why.
    });

    describe('Add Todo (Validation)', () => {

      afterEach(() => {
        page.click('exitWithoutAddingButton');
      });

      it('Should allow us to put information into the fields of the add todo dialog', () => {
        expect(page.field('ownerField').isPresent()).toBeTruthy('There should be an owner field');
        page.field('ownerField').sendKeys('Dana Jones');
        expect(element(by.id('bodyField')).isPresent()).toBeTruthy('There should be a body field');
        page.field('bodyField').sendKeys('Test body');
        expect(page.field('categoryField').isPresent()).toBeTruthy('There should be a category field');
        page.field('categoryField').sendKeys('cookies');
      });

      it('Should show the validation error message about owner being required', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        // '\b' is a backspace, so this enters an 'A' and removes it so this
        // field is "dirty", i.e., it's seen as having changed so the validation
        // tests are run.
        page.field('ownerField').sendKeys('A\b');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('categoryField').click();
        expect(page.getTextFromField('owner-error')).toBe('A todo must have an owner');
      });

      it('Should show the validation error message about the format of owner', () => {
        expect(element(by.id('ownerField')).isPresent()).toBeTruthy('There should be an owner field');
        page.field('ownerField').sendKeys('Don@ld Jones');
        expect(page.button('confirmAddTodoButton').isEnabled()).toBe(false);
        //clicking somewhere else will make the error appear
        page.field('categoryField').click();
        expect(page.getTextFromField('owner-error')).toBe('Owner must contain only numbers and letters');
      });
    });
  });
});
