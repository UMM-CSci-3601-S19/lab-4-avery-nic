package umm3601.todo;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

public class TodoController {

  private final MongoCollection<Document> todoCollection;

  public TodoController(MongoDatabase db) {
    todoCollection = db.getCollection("todos");
  }
}
