#! /usr/bin/env node

console.log(
  'This script populates your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Comment = require("./models/comment");
const User = require("./models/user");
const Post = require("./models/post");

const comments = [];
const users = [];
const posts = [];


const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createUsers();
  await createPosts();
  await createComments();
  
 
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function userCreate(username, password, followList, pendingList, img) { //timestamp was removed for the sake of testing to see if it will be added automatically
  const user  = new User({username:username, 
    password:password, 
    followList:followList,
    pendingList:pendingList,
    img:img,
  });
  /*if (d_birth != false) authordetail.date_of_birth = d_birth;
  if (d_death != false) authordetail.date_of_death = d_death;
  */

  await user.save();
  users.push(user);
  console.log(`Added user: ${username}`);
}

async function postCreate(user, body, title, likes) { //timestamp also removed for testing
  const post = new Post({ user: user, 
    body:body, 
    title:title,
    likes: likes});
  await post.save();
  posts.push(post);
  console.log(`Added Post: ${title} ${body}`);
}

async function commentCreate(user, post, body) { //timestamp aslo removed for testing
  const comment = new Comment({ user: user,
    post:post, 
    body:body});
  await comment.save();
  comments.push(post);
  console.log(`Added comment: ${user} ${body}`);
}



async function createUsers() {
  console.log("Adding Users");
  await Promise.all([
    userCreate("JimmyGibbs2009", "123456",[],[],"/gibbs.png"),
    userCreate("Bob20", "123456",[],[],"/bob.png"),
  ]);
}

async function createPosts() {
  console.log("Adding Posts");
  await Promise.all([
    await postCreate(users[0], "Eyo its me", "Interesting Title", 12),
    await postCreate(users[0], "I don't know why I just said that", "Very Interesting Title", 0),
    await postCreate(users[1], "I might be able to help", " Hello World", 3),
  ]);
}

async function createComments() {
  console.log("Adding comments");
  await Promise.all([
    commentCreate(users[0], posts[0], "Hi"),
    commentCreate(users[0], posts[1], "Nice Post",),
    commentCreate(users[1], posts[0], "Thanks for sharing",),
  ]);
}


/*async function createBooks() {
  console.log("Adding Books");
  await Promise.all([
    bookCreate(
      "The Name of the Wind (The Kingkiller Chronicle, #1)",
      "I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to Gods, loved women, and written songs that make the minstrels weep.",
      "9781473211896",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "The Wise Man's Fear (The Kingkiller Chronicle, #2)",
      "Picking up the tale of Kvothe Kingkiller once again, we follow him into exile, into political intrigue, courtship, adventure, love and magic... and further along the path that has turned Kvothe, the mightiest magician of his age, a legend in his own time, into Kote, the unassuming pub landlord.",
      "9788401352836",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "The Slow Regard of Silent Things (Kingkiller Chronicle)",
      "Deep below the University, there is a dark place. Few people know of it: a broken web of ancient passageways and abandoned rooms. A young woman lives there, tucked among the sprawling tunnels of the Underthing, snug in the heart of this forgotten place.",
      "9780756411336",
      authors[0],
      [genres[0]]
    ),
    bookCreate(
      "Apes and Angels",
      "Humankind headed out to the stars not for conquest, nor exploration, nor even for curiosity. Humans went to the stars in a desperate crusade to save intelligent life wherever they found it. A wave of death is spreading through the Milky Way galaxy, an expanding sphere of lethal gamma ...",
      "9780765379528",
      authors[1],
      [genres[1]]
    ),
    bookCreate(
      "Death Wave",
      "In Ben Bova's previous novel New Earth, Jordan Kell led the first human mission beyond the solar system. They discovered the ruins of an ancient alien civilization. But one alien AI survived, and it revealed to Jordan Kell that an explosion in the black hole at the heart of the Milky Way galaxy has created a wave of deadly radiation, expanding out from the core toward Earth. Unless the human race acts to save itself, all life on Earth will be wiped out...",
      "9780765379504",
      authors[1],
      [genres[1]]
    ),
    bookCreate(
      "Test Book 1",
      "Summary of test book 1",
      "ISBN111111",
      authors[4],
      [genres[0], genres[1]]
    ),
    bookCreate(
      "Test Book 2",
      "Summary of test book 2",
      "ISBN222222",
      authors[4],
      false
    ),
  ]);
}
*/
