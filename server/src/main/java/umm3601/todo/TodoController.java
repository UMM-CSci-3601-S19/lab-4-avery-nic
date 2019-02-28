package umm3601.todo;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;

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

    FindIterable<Document> matchingTodos = todoCollection.find(filterDoc);

    return serializeIterable(matchingTodos);
  }

  private String serializeIterable(Iterable<Document> documents) {
    return StreamSupport.stream(documents.spliterator(), false)
      .map(Document::toJson)
      .collect(Collectors.joining(", ", "[", "]"));
  }
}
