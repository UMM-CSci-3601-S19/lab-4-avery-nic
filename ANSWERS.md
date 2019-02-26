## Questions

1. :question: What do we do in the `Server` and `UserController` constructors
to set up our connection to the development database?
1. :question: How do we retrieve a user by ID in the `UserController.getUser(String)` method?
1. :question: How do we retrieve all the users with a given age 
in `UserController.getUsers(Map...)`? What's the role of `filterDoc` in that
method?
1. :question: What are these `Document` objects that we use in the `UserController`? 
Why and how are we using them?
1. :question: What does `UserControllerSpec.clearAndPopulateDb` do?
1. :question: What's being tested in `UserControllerSpec.getUsersWhoAre37()`?
How is that being tested?
1. :question: Follow the process for adding a new user. What role do `UserController` and 
`UserRequestHandler` play in the process?

## Your Team's Answers

1. Server.main() creates a new MongoClient and MongoDatabase,
and the UserController constructor retrieves a collection from
the database passed in by the server.
2. An id is passed in, the userCollection is queried using the id.
We get the next object out of the iterator, if there is a user to be found
it returns a string of json representing the user. If not, null 
is returned.
3. A map which represents the query parameters is passed in, and key value
pairs are inserted into the filterDoc. A FindIterable object is made from userCollection.find
which uses the filterDoc as a pattern to match against. A serialized
iterable is returned, which is a string made from matchingUsers.
4. The document objects are a representation of mongo db objects
which can be converted into json. We use them to obtain user information
from the user collection, filter users (filterDoc), and create new
users which are then inserted into the user collection.
5. clearAndPopulateDB makes sure the user collection is empty,
then inserts several Documents into the empty collection. This ensures the
same state of the collection every time this method is called. At the end,
userController is created using the test db.
6. The presence of two users named Jamie and Pat is being tested by calling
userController.getUsers and passing the constructed map with the age=37
parameter. Assertions are made about the size and the specific contents
of the returned result.
7. The server has a predefined route for adding a new user.
UserRequestHandler handles the http request sent from the server, and
sends that information to UserController. UserController inserts a new user
into the database.
