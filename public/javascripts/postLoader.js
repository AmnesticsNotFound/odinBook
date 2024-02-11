console.log("Everything is just peachy. postLoader has been...loaded");
// loads all posts on homepage
function loadPosts(posts) {
    let body = document.querySelector(".header");
    for (let i = 0; i < posts.length; ++i) {
        let x = 5;
        console.log(posts);
        let postMain = document.createElement("div");
        postMain.classList.add("postMain");
        let post = document.createElement("div");
        post.classList.add("posts");
        let title = document.createElement("a");
        title.innerText = posts[i].title;
        console.log(posts[i]._id);
        title.href=`http://localhost:3000/posts/${posts[i]._id}`
        let postBody = document.createElement("p");

        let likes = document.createElement("img");
        let likesCounter = document.createElement("h3");
        let likesDiv = document.createElement("div");
        likes.value = posts[i]._id;
        likesDiv.classList.add("likesDiv");
        likesCounter.innerText = posts[i].likes;
        likes.classList.add("likes");
        postBody.innerText = posts[i].body;

        likesDiv.appendChild(likes);
        likesDiv.appendChild(likesCounter);
        postMain.appendChild(likesDiv);
        post.appendChild(title);
        post.appendChild(postBody);
        body.appendChild(post);
        postMain.appendChild(post);
        body.appendChild(postMain);

    }

}


//adds event listeners to posts on homepage
function addPostListeners() {   
    let posts = document.querySelectorAll(".posts h2").forEach((post) => {
        post.addEventListener("click", (event) => {
            console.log("hi");
        })

    })
}
//loads post data for individual post pages
function loadPost(postInfo, comments) {
    let post = document.createElement("div");
    let postDiv = document.querySelector(".post");
    let title = document.createElement("h1");
    let postBody = document.createElement("p");
    postBody.classList.add("postBody");
    let username = document.createElement("h3");

    let likes = document.createElement("img");
    let likesCounter = document.createElement("h3");
    let likesDiv = document.createElement("div");
    likesDiv.classList.add("likesDiv");
    likesCounter.innerText = postInfo.likes;
    likes.classList.add("likes");
    likes.value = postInfo._id;
    //post.classList.add("posts");
    
    //console.log(postInfo)
    title.innerText = postInfo.title;
    //console.log(posts[i]._id)
    //title.href=`http://localhost:3000/posts/${posts[i]._id}`
    
    username.innerText = "Posted by: " + postInfo.user.username;
    postBody.innerText = postInfo.body;
    post.appendChild(title);
    post.append(username);
    post.appendChild(postBody);
    likesDiv.appendChild(likes);
    likesDiv.appendChild(likesCounter);
    post.appendChild(likesDiv);
    postDiv.insertBefore(post, postDiv.firstChild);
    


    //loading comments for post
    let commentsDiv = document.querySelector(".comments")
    for(let i = 0; i < comments.length; ++i) {
        let comment = document.createElement("div");
        comment.classList.add("comment");

        let username = document.createElement("a");
        username.classList.add("username");
        username.innerText = comments[i].user.username;
        username.href = `http://localhost:3000/users/profile/${comments[i].user._id}`;
        
        let timestamp = document.createElement("h5");
        timestamp.classList.add("timestamp");
        timestamp.innerText = new Date(comments[i].timestamp).toString();
        
        let img = document.createElement("img");
        img.src = comments[i].user.img;
        img.classList.add("commentUserImage");

        let comBody = document.createElement("p");
        let userTimeDiv = document.createElement("div");
        userTimeDiv.classList.add("userTime");

        let divider = document.createElement("hr");
        divider.classList.add("solid");

        let imgUsername = document.createElement("div");
        imgUsername.classList.add("imgUsername");
        imgUsername.value = comments[i].user.id;

        imgUsername.appendChild(img);
        imgUsername.appendChild(username);
        comBody.innerText = comments[i].body;
        userTimeDiv.appendChild(imgUsername);
        userTimeDiv.appendChild(timestamp);

        comment.appendChild(comBody);
        comment.appendChild(divider);
        comment.appendChild(userTimeDiv);
        
        // + " By: " + comment[i].user + " at " + comment[i].timestamp
        commentsDiv.appendChild(comment);
        
    }
}
//SOMETHING IS GOING IN THIS FILE I BELIEVE. IMAGES NOT LOADING AMONG OTHER FILES. OCCURS AFTER NEW COMMENT IS CREATED



