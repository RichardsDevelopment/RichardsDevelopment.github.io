# Welcome to my GitHub page!

My name is Eric Richards and I am a Computer Science student at Southern New Hampshire University. Over the last two years I have done quite a bit of programming and have developed a passion for it! These are just a couple of the projects I have undertaken, so check back regularly for updates and news regarding upcoming releases. Each logo button is clickable and will lead you to the projects repository, so be sure to check them out if you have not already done so!

## Code Review

In this video I identify the strengths and weaknesses of the code I chose to represent my strengths in Software Design and Engineering, Data Structures and Algorithms, and Databases. This is shown through two programs: D20Chat and BidTracker. I also my plans for future changes regarding these programs.

    Link to video here!!

## Software Engineering and Design

[![D20Chat Link](https://i.imgur.com/9YB3PsR.png)](https://github.com/RichardsDevelopment/D20Chat)

### 1. Choice

The artifact I chose to represent my skills in terms of software engineering and design is my D20Chat program. It is a simple web application used by tabletop gamers to communicate in different in-game languages. This keeps the game immersive and personal. This is a project I worked on about two years ago as an introduction to web development and Node.js, and I am proud of it!

### 2. Justification/ Skills Used

As a show of my skills, I believe this is one of the most complete artifacts I have. It shows my use of external libraries, object-oriented programming, and full-stack web development. I used JavaScript, HTML, CSS, and SQL to create it, as well as Linux commands while I set up my online server. It was very messy when I started work, but I have added comments for every section of code and cleaned the organization of the program.  This was my plan from the beginning, but I have found additional things I would like to work on. When I created the server-side JavaScript, I had very little knowledge of creating server scripts, and I used global variables for things that will have to be done for each logged-in user. This can cause all kinds of errors, so I would like to turn these into class variables for the sockets. This is an easy process but will take some time to refactor the code. 

### 3. Reflection

While enhancing the code, I realized how much easier code is to read with accurate comments! Most programs that I’ve written have been small and comments were forsaken, which was a big mistake. In reorganizing the code, I also realized how much easier it was to find something when it is organized! Clean code is good code, and I need to keep this in mind moving forward.

## Data Structures and Algorithms

[![BidTracker Link](https://i.imgur.com/sK1K7lC.png)](https://github.com/RichardsDevelopment/BidTracker)

### 1. Choice

The artifact included is one that I developed while in the Data Structures and Algorithms class. It was initially given to the class riddled with errors, and we were tasked with finding them and remedying them. It was created to load bid data from a comma-separated values file, insert them into a  binary search tree sorted by the bid ID, and allow a user to view all bids, add a bid, delete a bid, and view sorted bids. The only thing it was lacking was a simple to use GUI! I went through some tutorials and settled on Qt creator for the GUI and created what I believe to be an efficient and easy to use user-interface.

### 2. Justification/ Skills Used

This program was a great example of data structures and algorithms, and because of this I wanted to include it in my ePortfolio. It uses a binary search tree to store bid information and allows the user to perform actions on the binary search tree by calling specific functions. In order to implement these changes, I had to learn a whole framework! Qt is tough to learn initially, but there is a wealth of information out there that helped me along the way. I also discovered that it is much easier to just do things Qt’s way rather than trying to implement my own way. For example: a lot of my variables were strings and I wanted to keep them that way, but it complicated the process. I had to convert every string to a framework variable type QString, and vice-versa. I just decided to make everything a QString where possible, and it made the process much easier. I think I met all challenges head-on and excelled at each turn.

### 3. Reflection

I am more than thrilled with how it turned out! There are a few things I would like to improve moving forward, namely adding comments, properly formatting the code, and adding a “save” feature to the GUI allowing the user to save all changes to the csv file loaded. As of right now it doesn’t save changes, so clicking the “load” button will overwrite any changes. 

## Databases

[![D20Chat Link](https://i.imgur.com/9YB3PsR.png)](https://github.com/RichardsDevelopment/D20Chat)

### 1. Choice

For the databases portion of my ePortfolio I decided to include the server-side code of my D20Chat program. Since it is a messaging service with a login system, there is a lot of information that must be kept in a secure location. When I initially tackled this project, I was just starting out with SQL and had a tenuous grasp on the concepts, never mind efficiency best practices! Over the last two years I have developed more programs than I can remember , most of them using database connections and different programming languages. This is why I have decided to switch from SQL to MongoDB. 

### 2. Justification/ Skills Used

Mongo is much more efficient and reliable when it comes to big data sources like what my messaging service could see. This switch not only improved my program but showed that I have the Mongo and SQL skills to pull off a full-scale rewrite like this! I have learned how to use the mongodb NPM library for Node.js as well as numerous other concepts such as asynchronous function calls and socket variables.

### 3. Reflection

I think this project has helped to put things into perspective for me. I have been programming a lot and I feel I underestimated the time it would take me to learn a new concept (Qt) and switch everything over to Mongo. This is a mistake I will not make again! 

