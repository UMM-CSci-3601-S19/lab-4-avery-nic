package umm3601.todo;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

import java.util.Map;

public class TodoController {

  private final MongoCollection<Document> todoCollection;

  public TodoController(MongoDatabase db) {
    todoCollection = db.getCollection("todos");
  }

  public String getTodos(Map<String, String[]> queryParams) {
    return "";
  }
}
