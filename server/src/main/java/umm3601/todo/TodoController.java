package umm3601.todo;

import com.mongodb.MongoException;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;

import java.util.Map;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

public class TodoController {

  private final MongoCollection<Document> todoCollection;

  public TodoController(MongoDatabase db) {
    todoCollection = db.getCollection("todos");
  }

  public String getTodos(Map<String, String[]> queryParams) {
    Document filterDoc = new Document();

    if (queryParams.containsKey("owner")) {
      String requestedOwner = queryParams.get("owner")[0];
      Document ownerQuery = new Document();
      ownerQuery.append("$regex", requestedOwner);
      ownerQuery.append("$options", "i");
      filterDoc.append("owner", ownerQuery);
    }
    if (queryParams.containsKey("status")) {
      String requestedStatus = queryParams.get("status")[0];
      Document statusQuery = new Document();
      statusQuery.append("$regex", requestedStatus);
      statusQuery.append("$options", "i");
      filterDoc.append("status", statusQuery);
    }

    FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

    return serializeIterable(matchingTodos);
  }

  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }

  public String addNewTodo(String owner, String body, boolean status, String category) {

    Document newTodo = new Document();
    newTodo.append("owner", owner);
    newTodo.append("body", body);
    newTodo.append("status", status);
    newTodo.append("category", category);

    try {
      todoCollection.insertOne(newTodo);
      ObjectId id = newTodo.getObjectId("_id");
      System.err.println("Successfully added new todo [_id=" + id
        + ", owner=" + owner
        + ", body=" + body
        + " status=" + status
        + " category=" + category + ']');
      return id.toHexString();
    } catch (MongoException me) {
      me.printStackTrace();
      return null;
    }
  }
}
