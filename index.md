## Professional Self-Assessment

    My journey through the Computer Science program at SNHU has helped shape who I am as a developer. It has shown me how to conduct 
  myself in a professional way and how to perform every aspect of software development at a high level. When I started, I had no idea 
  what to expect or what I wanted from the program, I just knew that I had this new-found love for programming and I wanted to pursue a 
  career in the field! Since then I have learned many programming languages, frameworks, and services, but have also mastered important 
  topics such as:
  
  **-	Collaborating in a Team Environment**
    -Through my Collaboration and Team Projects class I learned how to use EGit alongside Eclipse for Java development, and used it to 
     create and merge branches, commit and push changes, pull/ fetch changes from the remote repository and merge them into my current 
     project, and many other functions associated with team development. Outside of the program, I have used the Git command line tool 
     to develop Android Applications and websites with a small team of developers. This has given me the knowledge to tackle team 
     development head on!
     
  **-	Communicating to Stakeholders**
    -There is an emphasis in the Computer Science program at SNHU on agile software development, and I utilized the principles 
     repeatedly. In this type of development environment there is an emphasis on deliverables and stakeholder feedback, and I feel 
     confident that I have adequately used all the concepts associated with Agile development at the highest level. Outside of the 
     program, I have used tools such as Trello to create a backlog of tasks that I would pick from during a development sprint. I would 
     then incorporate my changes, release it to the user, and allow them to give their feedback and recommend changes as necessary. 
     Though I have done this, there is still a lot to learn! Every stakeholder is different, so experience will only make me better!

  **-	Data Structures and Algorithms**
    -Throughout my coursework I was shown how to properly implement proper data structures such as linked lists, binary search trees, 
     and hash maps into my programs, as well as algorithms to traverse, sort, and search them. This was important to my success, so I 
     have decided to include my BidTracker program in this ePortfolio to show my talents in this area. 

  **-	Software Engineering and Design**
    -From planning to implementation, I was taught how to break apart a problem and develop a solution to fix it. I used this in every 
     class I took, including Java, C++, C#, Python, and even MongoDB and SQL. Outside of my coursework, I have developed two Android 
     appliciations, numerous websites, and a few desktop applications that required me to utilize software engineering and design 
     principles to complete. Over time I will add these projects to this portfolio!

  **-	Databases**
    -In every personal project I undertook I used either SQLite, SQL, or MongoDB. These were all concepts I learned throughout my 
     coursework, but that took hours of outside work to master. I was able to implement database solutions in Python, Java, C++, PHP, 
     and Javascript, and am confident in my abilities to plan, develop, and implement a proper database structure into any project I am 
     a part of!

  **-	Security**
    -Security is one of the most important aspects of programming. In a day and age where anyone can access any amount of information at 
     the click of a button, it is important to make sure that sensitive data is kept private and that the system developed can’t be 
     easily compromised. Security is always front and center in my development but was best shown through my use of Socket.IO with 
     Node.js in my D20Chat web application. Personal data is sent back and forth between the client and server, so it was important to 
     make sure it could not be intercepted and stolen. 

    In particular, there are two programs that most accurately show my skills: BidTracker and D20Chat. BidTracker is a program recently 
  developed based on a program written during my Data Structures and Algorithms class. It loaded a comma-separated values file filled 
  with auction bid data into a binary search tree and allowed the user to sort, traverse, search, and delete leaves from the tree. It 
  was usable but was only a command line program. I decided to learn the Qt framework in order to develop an efficient GUI for the 
  program. This showed my skills in software engineering and design, data structures and algorithms, C++, and Qt as well as my ability 
  to quickly learn and implement topics. A link to the repository containing this program as well as a validation for my changes can be 
  found below in the “Data Structures and Algorithms” section of my ePortfolio.

    D20Chat, on the other hand, was a web application of my own making. I am a tabletop gamer and always found it difficult to try and 
  pretend you didn’t hear something spoken in another in-game language. This program allowed a game manager to create a chat room and 
  add characters that a player can log in as. The manager can then talk to players in particular languages, making sure encoded messages 
  are sent to every player that can’t speak that language in game! It shows my skills in web development using HTML, CSS, and 
  Javascript, as well as Node.js, Socket.IO, security best practices, database design and implementation, and numerous other topics. 
  Links to this repository can be found in the “Software Engineering and Design” and “Databases” sections found below!

## Code Review

    In this video I identify the strengths and weaknesses of the code I chose to represent my strengths in Software Design and 
  Engineering, Data Structures and Algorithms, and Databases. This is shown through two programs: D20Chat and BidTracker. I also my 
  plans for future changes regarding these programs.

[![Code Review Video](https://i.imgur.com/DbimJgv.png)](https://youtu.be/K10crVmGWls)

## Software Engineering and Design

[![D20Chat Link](https://i.imgur.com/9YB3PsR.png)](https://github.com/RichardsDevelopment/D20Chat)

### 1. Choice

    The artifact I chose to represent my skills in terms of software engineering and design is my D20Chat program. It is a simple web 
  application used by tabletop gamers to communicate in different in-game languages. This keeps the game immersive and personal. This is 
  a project I worked on about two years ago as an introduction to web development and Node.js, and I am proud of it!

### 2. Justification/ Skills Used

    As a show of my skills, I believe this is one of the most complete artifacts I have. It shows my use of external libraries, object-
  oriented programming, and full-stack web development. I used JavaScript, HTML, CSS, and SQL to create it, as well as Linux commands 
  while I set up my online server. It was very messy when I started work, but I have added comments for every section of code and 
  cleaned the organization of the program.  This was my plan from the beginning, but I have found additional things I would like to work 
  on. When I created the server-side JavaScript, I had very little knowledge of creating server scripts, and I used global variables for 
  things that will have to be done for each logged-in user. This can cause all kinds of errors, so I would like to turn these into class 
  variables for the sockets. This is an easy process but will take some time to refactor the code. 

### 3. Reflection

     While enhancing the code, I realized how much easier code is to read with accurate comments! Most programs that I’ve written have 
   been small and comments were forsaken, which was a big mistake. In reorganizing the code, I also realized how much easier it was to 
   find something when it is organized! Clean code is good code, and I need to keep this in mind moving forward.

## Data Structures and Algorithms

[![BidTracker Link](https://i.imgur.com/sK1K7lC.png)](https://github.com/RichardsDevelopment/BidTracker)

### 1. Choice

    The artifact included is one that I developed while in the Data Structures and Algorithms class. It was initially given to the class 
  riddled with errors, and we were tasked with finding them and remedying them. It was created to load bid data from a comma-separated 
  values file, insert them into a  binary search tree sorted by the bid ID, and allow a user to view all bids, add a bid, delete a bid, 
  and view sorted bids. The only thing it was lacking was a simple to use GUI! I went through some tutorials and settled on Qt creator 
  for the GUI and created what I believe to be an efficient and easy to use user-interface.

### 2. Justification/ Skills Used

    This program was a great example of data structures and algorithms, and because of this I wanted to include it in my ePortfolio. It 
  uses a binary search tree to store bid information and allows the user to perform actions on the binary search tree by calling 
  specific functions. In order to implement these changes, I had to learn a whole framework! Qt is tough to learn initially, but there 
  is a wealth of information out there that helped me along the way. I also discovered that it is much easier to just do things Qt’s way 
  rather than trying to implement my own way. For example: a lot of my variables were strings and I wanted to keep them that way, but it 
  complicated the process. I had to convert every string to a framework variable type QString, and vice-versa. I just decided to make 
  everything a QString where possible, and it made the process much easier. I think I met all challenges head-on and excelled at each 
  turn.

### 3. Reflection

    I am more than thrilled with how it turned out! There are a few things I would like to improve moving forward, namely adding 
  comments, properly formatting the code, and adding a “save” feature to the GUI allowing the user to save all changes to the csv file 
  loaded. As of right now it doesn’t save changes, so clicking the “load” button will overwrite any changes. 

## Databases

[![D20Chat Link](https://i.imgur.com/9YB3PsR.png)](https://github.com/RichardsDevelopment/D20Chat)

### 1. Choice

    For the databases portion of my ePortfolio I decided to include the server-side code of my D20Chat program. Since it is a messaging 
  service with a login system, there is a lot of information that must be kept in a secure location. When I initially tackled this 
  project, I was just starting out with SQL and had a tenuous grasp on the concepts, never mind efficiency best practices! Over the last 
  two years I have developed more programs than I can remember , most of them using database connections and different programming 
  languages. This is why I have decided to switch from SQL to MongoDB. 

### 2. Justification/ Skills Used

    Mongo is much more efficient and reliable when it comes to big data sources like what my messaging service could see. This switch 
  not only improved my program but showed that I have the Mongo and SQL skills to pull off a full-scale rewrite like this! I have 
  learned how to use the mongodb NPM library for Node.js as well as numerous other concepts such as asynchronous function calls and 
  socket variables.

### 3. Reflection

    I think this project has helped to put things into perspective for me. I have been programming a lot and I feel I underestimated the 
  time it would take me to learn a new concept (Qt) and switch everything over to Mongo. This is a mistake I will not make again! 

