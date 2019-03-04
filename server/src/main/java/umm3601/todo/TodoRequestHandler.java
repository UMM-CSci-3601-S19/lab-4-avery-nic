package umm3601.todo;

import org.bson.Document;
import spark.Request;
import spark.Response;

public class TodoRequestHandler {

  private final TodoController todoController;

  public TodoRequestHandler(TodoController todoController) {
    this.todoController = todoController;
  }

  public String getTodos(Request req, Response res) {
    res.type("application/json");
    return todoController.getTodos(req.queryMap().toMap());
  }

  public String addNewTodo(Request req, Response res) {
    res.type("application/json");

    Document newTodo = Document.parse(req.body());

    String owner = newTodo.getString("owner");
    String body = newTodo.getString("body");
    boolean status = newTodo.getBoolean("status");
    String category = newTodo.getString("category");

    System.err.println("Adding new todo [owner=" + owner
      + ", body=" + body
      + " status=" + status
      + " category=" + category + ']');
    return todoController.addNewTodo(owner, body, status, category);
  }
}
