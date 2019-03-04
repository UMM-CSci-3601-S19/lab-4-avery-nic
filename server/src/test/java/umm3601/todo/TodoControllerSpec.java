package umm3601.todo;

import com.mongodb.BasicDBObject;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.*;
import org.bson.codecs.*;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.json.JsonReader;
import org.bson.types.ObjectId;
import org.junit.Before;
import org.junit.Test;

import java.util.*;
import java.util.stream.Collectors;

import static org.junit.Assert.*;

/**
 * JUnit tests for the TodoController.
 * <p>
 */

public class TodoControllerSpec {
  private TodoController todoController;
  private ObjectId singleTodoId;

  @Before
  public void clearAndPopulateDB() {
    MongoClient mongoClient = new MongoClient();
    MongoDatabase db = mongoClient.getDatabase("test");
    MongoCollection<Document> todoDocuments = db.getCollection("todos");
    todoDocuments.drop();
    List<Document> testTodos = new ArrayList<>();
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Chris\",\n" +
      "                    body: \"This is Chris's task\",\n" +
      "                    status: true,\n" +
      "                    category: \"software design\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Pat\",\n" +
      "                    body: \"This is Pat's todo\",\n" +
      "                    status: false,\n" +
      "                    category: \"video games\"\n" +
      "                }"));
    testTodos.add(Document.parse("{\n" +
      "                    owner: \"Jamie\",\n" +
      "                    body: \"This is Jamie's todo\",\n" +
      "                    status: true,\n" +
      "                    category: \"groceries\"\n" +
      "                }"));

    singleTodoId = new ObjectId();
    BasicDBObject singleTodo = new BasicDBObject("_id", singleTodoId);
    singleTodo = singleTodo.append("owner", "Geoffrey")
      .append("body", "This is Geoffrey's todo")
      .append("status", false)
      .append("category", "fishing");

    todoDocuments.insertMany(testTodos);
    todoDocuments.insertOne(Document.parse(singleTodo.toJson()));

    todoController = new TodoController(db);
  }

  // http://stackoverflow.com/questions/34436952/json-parse-equivalent-in-mongo-driver-3-x-for-java
  private BsonArray parseJsonArray(String json) {
    final CodecRegistry codecRegistry
      = CodecRegistries.fromProviders(Arrays.asList(
      new ValueCodecProvider(),
      new BsonValueCodecProvider(),
      new DocumentCodecProvider()));

    JsonReader reader = new JsonReader(json);
    BsonArrayCodec arrayReader = new BsonArrayCodec(codecRegistry);

    return arrayReader.decode(reader, DecoderContext.builder().build());
  }

  private static String getOwner(BsonValue val) {
    BsonDocument doc = val.asDocument();
    return ((BsonString) doc.get("owner")).getValue();
  }

  @Test
  public void getAllTodos() {
    Map<String, String[]> emptyMap = new HashMap<>();
    String jsonResult = todoController.getTodos(emptyMap);
    BsonArray docs = parseJsonArray(jsonResult);

    assertEquals("Should be 4 todos", 4, docs.size());
    List<String> owners = docs
      .stream()
      .map(TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOwners = Arrays.asList("Chris", "Geoffrey", "Jamie", "Pat");
    assertEquals("Owners should match", expectedOwners, owners);
  }

  @Test
  public void getTodoByOwner() {
    Map<String, String[]> argMap = new HashMap<>();
    //Mongo in TodoController is doing a regex search so can just take a Java Reg. Expression
    //This will search the owner starting with an I or an F
    argMap.put("owner", new String[]{"[C,P]"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);
    assertEquals("Should be 2 todos", 2, docs.size());
    List<String> owner = docs
      .stream()
      .map(TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    List<String> expectedOwner = Arrays.asList("Chris", "Pat");
    assertEquals("Owners should match", expectedOwner, owner);
  }

  @Test
  public void addTodoTest() {
    String newId = todoController.addNewTodo("Alex", "This is Alex's todo", false, "video games");

    assertNotNull("Add new todo should return true when todo is added", newId);
    Map<String, String[]> argMap = new HashMap<>();
    argMap.put("owner", new String[]{"Alex"});
    String jsonResult = todoController.getTodos(argMap);
    BsonArray docs = parseJsonArray(jsonResult);

    List<String> owner = docs
      .stream()
      .map(TodoControllerSpec::getOwner)
      .sorted()
      .collect(Collectors.toList());
    assertEquals("Should return todo's owner", "Alex", owner.get(0));
  }
}
