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
}
