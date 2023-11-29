# Overview
The application enables live code writing interaction between a student and a mentor. It provides the student with code challenges to solve, while the mentor can observe real-time progress. Additionally, it evaluates submitted code and notifies the student upon successful completion of challenges. 


# Technologies Used
### Frontend
- React: A JavaScript library for building user interfaces. React is used to create interactive and responsive components for the application's frontend.
- Fetch API: The application leverages the Fetch API to communicate with the backend
- CSS Styling: Custom styling is applied using a dedicated CSS files to enhance the layout and presentation of components.
### Backend
- Node.js: A JavaScript runtime used to execute server-side logic.
- Express.js: A web application framework for Node.js. Express is used to handle server operations, manage routes, and interact with the frontend.
- Socket.io: Used for establishing WebSocket connections between the client and server, facilitating real-time communication.
### Database
- MySQL Database: The database system used to store and manage data in the backend.


## How It Works
The frontend, developed using React, presents the user interface to clients. React Router is used for managing application routing, ensuring navigation between different pages.

Upon client interaction, the frontend communicates with the Node.js backend, while The backend, powered by Node.js and Express.js, handles incoming requests, processes data, and interacts with the MySQL database to perform operations.

The database contains a table named "codeblocks" with these fields:
1. code_id: Unique identifier for each code block.
2. title: Name of the code block.
3. code: Content of the code block.
4. mentor: Represents the mentor; contains the session ID. (-1 if no mentor is assigned)
5. solution: Holds the perfect code solution for the task associated with the code block.

When a client connects to the server, a WebSocket using Socket.io is opened, allowing real-time communication between the client and server. This socket establishes the user's session ID, enabling identification and representation of individual users during their interaction with the application.

When a user enters a code block, if the mentor field in the matched codeblock row in database is -1, indicating no mentor, the user becomes the mentor by setting their session ID in that field. If the field isn't -1, the user understands that he is a student. When the mentor leaves, he sets the mentor field back to -1, signaling no mentor currently.



lastly, the solutions to the codes are :
'HELLO'
'WORLD'
'FROM'
'ROY'
'MAMAN'

in that order + they are case sensitive
