function loadUsers(users,user) {
    let centerDiv = document.querySelector(".userDivs");
    //initalize elements for user data
    
    console.log(users.length);
    //assign user data to elements
    for (let i = 0; i < users.length; ++i) {
        if (users[i]._id === user._id) {
            continue;
        }
        let userDiv = document.createElement("div");
        userDiv.classList.add("userDiv");
        let img = document.createElement("img");
        let username = document.createElement("h3");
        let followStatus = document.createElement("button");
        followStatus.classList.add("followButtons");
        followStatus.value = users[i]._id;
        let followList = users[i].followList;
        let pendingList = users[i].pendingList;

        username.innerText = users[i].username;
        img.src = users[i].img;
        //console.log(user._id);
        //check if current user is following, pending a follow, or not following a particular user
        if(followList.includes(user._id)) {
            followStatus.innerText = "Unfollow";
        }
        else if(pendingList.includes(user._id)) {
            followStatus.innerText = "Pending";
        }
        else {
            followStatus.innerText = "Follow";
        }
        


        userDiv.appendChild(img);
        userDiv.appendChild(username);
        userDiv.appendChild(followStatus);

        centerDiv.appendChild(userDiv);

    }

}