//Global variables
var welcomeview;
var profileview;
var passWrdLen = 3;
var userToken = "";
var password = "";

displayView = function(view){
// the code required to display a view
  document.getElementById("displayWindow").innerHTML = view.innerHTML;
};

window.onload = function(){
//code that is executed as the page is loaded.
  var token = localStorage.getItem("token");
  if(token !=  null){
    profileview = document.getElementById("profileview");
    displayView(profileview);

  } else {
    welcomeview = document.getElementById("welcomeview");
    displayView(welcomeview);
  }

};

function activeTab(id){
  var homeTab = document.getElementById("HomeTab");
  var browseTab = document.getElementById("BrowseTab");
  var accTab = document.getElementById("AccTab");

  var homeBtn = document.getElementById("HomeBtn");
  var browseBtn = document.getElementById("BrowseBtn");
  var accBtn = document.getElementById("AccBtn");

  //Display right color and page
  if( id == homeTab ){
    homeTab.style.display = "block";
    browseTab.style.display = "none";
    accTab.style.display = "none";

    homeBtn.style.background = "#6e6e6e";
    browseBtn.style.background = "none";
    accBtn.style.background = "none";
  }
  else if(id == browseTab){
    homeTab.style.display = "none";
    browseTab.style.display = "block";
    accTab.style.display = "none";

    homeBtn.style.background = "none";
    browseBtn.style.background = "#6e6e6e";
    accBtn.style.background = "none";

  }
  else if(id == accTab){
    homeTab.style.display = "none";
    browseTab.style.display = "none";
    accTab.style.display = "Block";

    homeBtn.style.background = "none";
    browseBtn.style.background = "none";
    accBtn.style.background = "#6e6e6e";
  }
}


// Sign in user
function signIn(){
  var email = document.getElementById("email").value;
  password = document.getElementById("psw").value;
  var logInMessage = document.getElementById("logInMessage");
  //var user = serverstub.signIn(username, psw);

  try {
    var user = {'email': email, 'password': password};

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          if (response.success) {
            localStorage.setItem("token", response.data);
            //userToken = response.data;
            displayView(profileview);
            getUserData();

          } else {
            logInMessage.innerHTML = response.message;
          }
        }
      }
    }
    req.open("POST", "/sign-in", true);
    req.setRequestHeader("Content-type", "application/json");
    req.send(JSON.stringify(user));
  } catch(e){
    console.error(e);
  }
  // if(user.success == true){
  //   // Get user token and display view
  //   displayView(profileview);
  //   userToken = user.data;
  //   getUserData(userToken);
  //
  // }else{
  //   logInMessage.innerHTML = user.message;
  // }
}


function signUp(){
  var emailSignUp = document.getElementById("email-signUp").value;
  var nameSignUp  = document.getElementById("name-signUp").value;
  var famSignUp = document.getElementById("fam-signUp").value;
  var gender = document.getElementById("gender").value;
  var city = document.getElementById("city").value;
  var country = document.getElementById("country").value;

  var message = document.getElementById("message");

  // Check requirements for password
  var password = document.getElementById("psw-signUp").value;
  var passwordRpt = document.getElementById("pswRpt").value;
  var psw_len = document.getElementById("psw_len");
  var psw_match = document.getElementById("psw_match");

  try{
    var newUser = {
      "email":emailSignUp,
      "password":password,
      "firstname":nameSignUp,
      "familyname":famSignUp,
      "gender":gender,
      "city":city,
      "country":country
    };

    //Reset hidden text
      psw_len.style.display = "none";
      psw_match.style.display = "none";
    //Password validation
      if(password.length < passWrdLen){
        psw_len.style.display = "block";
      }
      else if(password != passwordRpt){
        psw_match.style.display = "block";
      }
      else{

        var req = new XMLHttpRequest();
        req.onreadystatechange = function() {
          if (this.readyState == 4){
            if(this.status == 200){
              var response = JSON.parse(req.responseText);
              message.innerHTML = response.message;

            } else{
              message.innerHTML = message;

            }
          }
        }
        req.open("POST", "/sign-up", true);
        req.setRequestHeader("Content-type", "application/json");
        req.send(JSON.stringify(newUser));
      }
    // var newUserProfile = serverstub.signUp(newUser);
    // var message = document.getElementById("message");
    // message.innerHTML = newUserProfile.message;
  } catch(e) {
    console.error(e);
  }
}

function pswChange(){
  var token = localStorage.getItem("token");
  var oldPsw = document.getElementById("oldPsw").value;
  var changePsw = document.getElementById("changePsw").value;
  var pswRptnew = document.getElementById("pswRptnew").value;

  var psw_len = document.getElementById("psw_len");
  var psw_match = document.getElementById("psw_match");
  var message = document.getElementById("passMessage");

  try {
    var sendData = {'oldPassword': oldPsw, 'newPassword': changePsw};

    //Reset hidden text
      psw_len.style.display = "none";
      psw_match.style.display = "none";
    //Password validation
      if(changePsw.length < passWrdLen){
        psw_len.style.display = "block";
      }
       else if(changePsw != pswRptnew){
         psw_match.style.display = "block";
       }
      else if(oldPsw != psw){
        message.innerHTML = "Old password not correct!";
      }
      else{

        var req = new XMLHttpRequest();
        req.onreadystatechange = function(){

          if (this.readyState == 4){
            if(this.status == 200){
              var response = JSON.parse(req.responseText);
              message.innerHTML = response.message;
              if(response.success){
                message.innerHTML = "Password changed";

              } else{
                message.innerHTML = response.message;

              }
            }
          }
        }
        req.open("PUT", "/change-password", true);
        req.setRequestHeader("Content-type", "application/json");
        req.setRequestHeader("Authorization", token);
        req.send(JSON.stringify(sendData));
  }

      // serverstub.changePassword(userToken, oldPsw, changePsw);
      // message.innerHTML = "password changed";
    } catch(e) {
      console.error(e);
    }
}

function getUserData(){
  // returns the object containing firstname, familyname etc...
  // var getUser = serverstub.getUserDataByToken(userToken);
  // var userData = getUser.data;
  var token = localStorage.getItem("token");

  try {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          if(response.success){
            var userData = response.data;

            document.getElementById("nameLabel").innerHTML =   "Name:   " + userData.firstname + " " + userData.familyname;
            document.getElementById("genderLabel").innerHTML = "Gender: " + userData.gender;
            document.getElementById("cityLabel").innerHTML =   "City:   " + userData.city;
            document.getElementById("countryLabel").innerHTML ="Country: " + userData.country;
            document.getElementById("emailLabel").innerHTML =  "Email:  " + userData.email;

        }
      }
    }
    req.open("GET", "/getdatatoken", true);
    req.setRequestHeader("Authorization", token);
    //req.setRequestHeader("Content-Type", "application/json");
    req.send();
  } catch(e) {
    console.error(e);
  }

}

//getUserDataByToken
function postWall(toEmail){

  var token = localStorage.getItem("token");
  var newPost = document.getElementById("postBox").value;
  var messWall = document.getElementById("pMess");

  try {
    var postMessage = {"message": newPost, "email": toEmail};
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          messWall.innerHTML = response.message;
        }
      }
    }
    req.open("POST", "/post-message", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send(JSON.stringify(postMessage));
  } catch(e){
    console.error(e);
  }
  //Get user info
  // var getUser = serverstub.getUserDataByToken(userToken);
  // var userData = getUser.data;
  // var email = userData.email;
  // var postMess = serverstub.postMessage(userToken, newPost, email);
}

//getUserMessagesByToken
function displayWall(){

  var token = localStorage.getItem("token");

  try {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if(this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          if(response.success){
            var messages = response.data;
            document.getElementById("wall").innerHTML = null;
            for(i = 0; i < messages.length; i++){
              document.getElementById("wall").innerHTML +=
              "<p>"+ "Posted by " + messages[i].writer + "<br>" + messages[i].content + "<br></p>";
            }
          } else {
            document.getElementById("wall").innerHTML = null;
          }
        }
      }
    }
    req.open("GET", "/getmessagestoken", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send();
  } catch(e){
    console.error(e);
  }

  // var getMessages = serverstub.getUserMessagesByToken(userToken);
  // if (getMessages.success == true){
  //   var messages = getMessages.data;
  //   document.getElementById("wall").innerHTML = null;
  //
  //   for(i = 0; i < messages.length; i++){
  //     document.getElementById("wall").innerHTML += "<p>From: " + messages[i].writer + "<br>";
  //     document.getElementById("wall").innerHTML += messages[i].content + "<br></p>" ;
  //   }
  // }
}

//getUserMessagesByEmail
function loadMessages(){

  var token = localStorage.getItem("token");
  var email = document.getElementById("browseuser").value;
  try {
    var user = {"email": email};
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if(this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          if(response.success){
            var messages = response.data;
            document.getElementById("messageWall").innerHTML = null;
            for(i = 0; i < messages.length; i++){
                 document.getElementById("messageWall").innerHTML +=
                 "<p>From: " + messages[i].writer + "<br>" messages[i].content + "<br></p>";
                 //document.getElementById("messageWall").innerHTML += messages[i].content + "<br></p>" ;
            }

          } else {
            document.getElementById("messageWall").innerHTML = null;
          }
        }
      }
    }
    req.open("GET", "/getmessagesemail", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send(JSON.stringify(user));

  } catch(e){
    console.error(e);
  }
  // var getMessages = serverstub.getUserMessagesByEmail(userToken, email);
  // if (getMessages.success == true){
  //   var messages = getMessages.data;
  //   document.getElementById("messageWall").innerHTML = null;
  //   for(i = 0; i < messages.length; i++){
  //     document.getElementById("messageWall").innerHTML += "<p>From: " + messages[i].writer + "<br>";
  //     document.getElementById("messageWall").innerHTML += messages[i].content + "<br></p>" ;
}

var otherEmail;

// getuserdatabyemail
function browseUser(){

   var token = localStorage.getItem("token");
   otherEmail = document.getElementById("browseuser").value;
   //var userInfo = serverstub.getUserDataByEmail(userToken, otherEmail);
   try {
     var userEmail = {"email": otherEmail};
     var req = new XMLHttpRequest();
     req.onreadystatechange = function() {
       if(this.readyState == 4){
         if(this.status == 200){
           var response = JSON.parse(req.responseText);
           if(response.success){
             var browseUserInfo = document.getElementById("browseUserInfo");
             var browseUserBlock = document.getElementById("browseUser");
             //Display right view
             browseUserInfo.style.display = "block";
             browseUserBlock.style.display = "none";

             var userData = response.data;
             document.getElementById("nameBr").innerHTML =   "Name:   " + userData.firstname + " " + userData.familyname;
             document.getElementById("genderBr").innerHTML = "Gender: " + userData.gender;
             document.getElementById("cityBr").innerHTML =   "City:   " + userData.city;
             document.getElementById("countryBr").innerHTML ="Country: " + userData.country;
             document.getElementById("emailBr").innerHTML =  "Email:  " + userData.email;
             loadMessages();
           } else {
             document.getElementById("errorSearch").innerHTML = response.message;
           }
         }
       }
     }
     req.open("GET", "/getdataemail", true);
     req.setRequestHeader("Content-Type", "application/json");
     req.setRequestHeader("Authorization", token);
     req.send(JSON.stringify(userEmail));
   } catch(e){
     console.error(e);
   }

   //   var data = userInfo.message;
   //   document.getElementById("errorSearch").innerHTML = data;

}

// EJ KLAR
//getUserDataByEmail
function postOnUserWall(){
  //Get user info
  var token = localStorage.getItem("token");
  otherEmail = document.getElementById("browseuser").value;

  var messWall = document.getElementById("feedbackBox");
  var newPost = document.getElementById("postBoxBrowse").value;

  try {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          if(response.success){
            var userData = response.data;
            displayOnUserWall();
          }
        }
      }
    }
    req.open("GET", "/getdataemail", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send(JSON.stringify(userEmail));
  } catch(e){
    console.error(e);
  }

  //var getUser = serverstub.getUserDataByEmail(userToken,otherEmail);  //getUserDataByToken(userToken);
  // var userData = getUser.data;
  // if(getUser.success == true){
  // Save post
  // var messWall = document.getElementById("feedbackBox");
  // var newPost = document.getElementById("postBoxBrowse").value;
  // var postMess = serverstub.postMessage(userToken, newPost, otherEmail);
  //
  // newPost.innerHTML = postMess.message;
  // displayOnUserWall();
  }
}

//EJ KLAR
function displayOnUserWall(){
  otherEmail = document.getElementById("browseuser").value;
  //var getMessages = serverstub.getUserMessagesByEmail(userToken,otherEmail)
  // if (getMessages.success == true){
  //   var messages = getMessages.data;
  //   document.getElementById("messageWall").innerHTML = null;
  //
  //   for(i = 0; i < messages.length; i++){
  //     document.getElementById("messageWall").innerHTML += "<p>From: " + messages[i].writer + "<br>";
  //     document.getElementById("messageWall").innerHTML += messages[i].content + "<br></p>" ;
  //   }
  // }
}

// ---SIGN OUT-----------------
function signOut(){

  var token = localStorage.getItem("token");
  try {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          if (response.success){
            //userToken = null;
            localStorage.removeItem("token");
            displayView(welcomeview);
          }
        }
      }
    }
    req.open("DELETE", "/sign-out", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send();
  } catch(e) {
    console.error(e);
  }
  //var sendtoken = {"token": userToken};
  // serverstub.signOut(userToken);
  // displayView(welcomeview);
}
