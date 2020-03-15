//Global variables
var welcomeview;
var profileview;
var passWrdLen = 3;
var password = "";
var port = "5000";

displayView = function(view){
// the code required to display a view
  document.getElementById("displayWindow").innerHTML = view.innerHTML;
};

window.onload = function(){
//code that is executed as the page is loaded.
  var token = localStorage.getItem("token");
  profileview = document.getElementById("profileview");
  welcomeview = document.getElementById("welcomeview");
  //connect_socket()
  if (token){
    connect_socket();
    displayView(profileview);
    getUserData();

  }else{
    displayView(welcomeview);
  }


};

function connect_socket(){

  // if(window.location.protocol == "https:"){
  //   var ws_scheme = "wss://";
  // }else {
  //   var ws_scheme = "ws://";
  // }
  // var host = location.host;
  var socket = new WebSocket("ws://" + document.domain+ ':' + port + "/api");
  //var socket = new WebSocket(ws_scheme+host+"/api"); //127.0.0.1:5000/api");
  console.log("Calling socket");
  socket.onopen = function (){
    console.log("WebSocket we are here");
    var msg = {'token': localStorage.getItem('token')};

    if(msg !== undefined){
      console.log(msg["token"]);
      socket.send(JSON.stringify(msg));
    }

  };
  socket.onmessage = function(event){
    console.log(event.data)
    var msg = JSON.parse(event.data);
    if(msg.success == false){
      signOut();
      displayView(welcomeview);
      //var data = msg.data;
      //localStorage.removeItem("token");
      // console.log(msg.data);
      // window.onload();
      // return
    } else {
      console.log("Successfully signed in!")
    }
  };

  socket.onclose = function() {
    signOut();
    displayView(welcomeview);
    console.log("Websocket closed");
  };

  socket.onerror = function(){
    console.log("Error in websocket");
  };


  // var socket = new WebSocket("ws://" + document.domain + ":5000/api");
  // //var data = localStorage.getItem('token');
  //
  // socket.onopen = function(){
  //
  //   var data = {
  //     'token': localStorage.getItem('token')
  //     'email': localStorage.getItem('email')
  //   };
  //   console.log(data["token"]);
  //   socket.send(JSON.stringify(data));
  //   console.log("tja")
  //
  // }
  //
  // socket.onmessage = function(event){
  //   //window.alert("Connection websocket");
  //   console.log(event.data);
  //   var msg = JSON.parse(event.data);
  //
  //   if(msg.success == false){
  //     localStorage.removeItem('token');
  //     console.log(msg.data);
  //     socket.close()
  //     return
  //   }else {
  //     console.log("Successfully signed in")
  //   }
  // };
  //
  //

}



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

//-----------------WELCOME PAGE -----------------------
// Sign in user
function signIn(){
  var email = document.getElementById("email").value;
  password = document.getElementById("psw").value;
  var logInMessage = document.getElementById("logInMessage");

  try {
    var user = {'email': email, 'password': password};

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          if (response.success) {
            localStorage.setItem("token", response.data);
            localStorage.setItem("email", email);

            connect_socket();
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
}

//sign-up new user
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

// ------------------HOME TAB---------------------------------
//get user data, getdatabytoken
function getUserData(){
  // returns the object containing firstname, familyname etc...
  var token = localStorage.getItem("token"); //user token

    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
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
  req.setRequestHeader("Content-Type", "application/json");
  req.send();
}

var loggedInUsers = {}

//post to own wall, postmessage
function postWall(){

  var token = localStorage.getItem("token");
  var newPost = document.getElementById("postBox").value;
  var messWall = document.getElementById("pMess");
  var toEmail = localStorage.getItem("email");

    var postMessage = {"message": newPost, "email": toEmail};
    console.log(postMessage)
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var response = JSON.parse(req.responseText);
        if(response.success){
          console.log(response[0])

        }else {
          console.log("Something went wrong");
        }
      }
    }
    req.open("POST", "/post-message", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send(JSON.stringify(postMessage));
}

//display messages, getUserMessagesByToken
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
              "<p>"+ "Posted by " + messages[i].fromEmail + "<br>" + messages[i].message + "<br></p>";

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
}

//----------------------BROWSE TAB --------------------------
//load user messages, getUserMessagesByEmail
function loadMessages(){

  var token = localStorage.getItem("token");
  var email = document.getElementById("browseuser").value;
  try {
    var user = {"email": email};
    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
      if(this.readyState == 4 && this.status == 200){
        var response = JSON.parse(req.responseText);
        if(response.success){
          var messages = response.data;
          document.getElementById("messageWall").innerHTML = null;
          for(i = 0; i < messages.length; i++){
               document.getElementById("messageWall").innerHTML +=
               "<p>" + "From " + messages[i].fromEmail + "<br>" + messages[i].message + "<br>" + "To: " + messages[i].toEmail + "<br></p>";
          }
        } else {
          document.getElementById("messageWall").innerHTML = null;
        }
      }
    }
    req.open("POST", "/getmessagesemail", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send(JSON.stringify(user));

  } catch(e){
    console.error(e);
  }
}

var otherEmail;

//browse for a user, getuserdatabyemail
function browseUser(){

   var token = localStorage.getItem("token"); //user token
   otherEmail = document.getElementById("browseuser").value; //searched user email

     var req = new XMLHttpRequest();
     req.onreadystatechange = function() {
       if(this.readyState == 4 && this.status == 200){
           var response = JSON.parse(req.responseText);
           if(response.success){
             var browseUserInfo = document.getElementById("browseUserInfo");
             var browseUserBlock = document.getElementById("browseUser");
             //Display right view
             browseUserInfo.style.display = "block";
             browseUserBlock.style.display = "none";

             var userData = response.data;
             document.getElementById("nameBr").innerHTML =   "<p>" + "Name: " + userData.firstname + " " + userData.familyname + "<br>";
             document.getElementById("genderBr").innerHTML = "Gender: " + userData.gender + "<br>";
             document.getElementById("cityBr").innerHTML =   "City:   " + userData.city + "<br>";
             document.getElementById("countryBr").innerHTML ="Country: " + userData.country + "<br>";
             document.getElementById("emailBr").innerHTML =  "Email:  " + userData.email + "<br></p>";
             loadMessages(); //load user messages
           } else{
             document.getElementById("errorSearch").innerHTML = response.message;
           }
       }
     }
     var userEmail = {'otherEmail': otherEmail};
     console.log(userEmail)
     req.open("POST", "/getdataemail", true);
     req.setRequestHeader("Content-Type", "application/json");
     req.setRequestHeader("Authorization", token);
     req.send(JSON.stringify(userEmail));
}

//post on other users wall, getUserDataByEmail
function postOnUserWall(){
  //Get user info
  var token = localStorage.getItem("token");
  var messWall = document.getElementById("feedbackBox");
  var newPost = document.getElementById("postBoxBrowse").value;

  try {
    var postMess = {"message": newPost, "email": otherEmail};
    console.log(postMess)
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var response = JSON.parse(req.responseText);
        if(response.success){
          var userData = response.data;
          if(userData.success){
            newPost.innerHTML = response.message;
            displayOnUserWall();
          }
        }
      }
    }
    req.open("POST", "/post-message", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send(JSON.stringify(postMess));

  } catch(e){
    console.error(e);
  }
}

//display user messages, getUserMessagesByEmail
function displayOnUserWall(){

  var token = localStorage.getItem("token"); //user token

  try{
    var getMessages = {"email": otherEmail};
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4){
        if(this.status == 200){
          var response = JSON.parse(req.responseText);
          if(response.success){
            var messages = response.data;
            document.getElementById("messageWall").innerHTML = null;

            for(i = 0; i < messages.length; i++){
              document.getElementById("messageWall").innerHTML +=
              "<p>" +"Posted by: " + messages[i].fromEmail + "<br>" + messages[i].message + "<br>" + "To:" + messages[i].toEmail + "<br></p>";
            }
          }
        }
      }
    }
    req.open("POST", "/getmessagesemail", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.setRequestHeader("Authorization", token);
    req.send(JSON.stringify(getMessages));
  } catch(e){
    console.error(e);
  }
}

//-------------------ACCOUNT TAB---------------------------
//change password
function pswChange(){
  var token = localStorage.getItem("token");
  var oldPsw = document.getElementById("oldPsw").value;
  var changePsw = document.getElementById("changePsw").value;
  var pswRptnew = document.getElementById("pswRptnew").value;

  var psw_len = document.getElementById("psw_len");
  var psw_match = document.getElementById("psw_match");
  var message = document.getElementById("passMessage");

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
  else if(oldPsw != password){
    message.innerHTML = "Old password not correct!";
  }
  else{

    var req = new XMLHttpRequest();
    req.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200){
      var response = JSON.parse(req.responseText);
      message.innerHTML = response.message;
      // if(response.success){
      //   message.innerHTML = "Password changed";
      // } else{
      //   psw_len.style.display = "Something went wrong";
      // }
    }
  }
  var sendData = {'oldPassword': oldPsw, 'newPassword': pswRptnew};
  console.log(sendData)
  req.open("PUT", "/change-password", true);
  req.setRequestHeader("Content-type", "application/json");
  req.setRequestHeader("Authorization", token);
  req.send(JSON.stringify(sendData));
  }
}

// ---------------SIGN OUT USER-----------------
function signOut(){

  var token = localStorage.getItem("token"); //user-token

  try {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if(this.readyState == 4 && this.status == 200){
        var response = JSON.parse(req.responseText);
        if (response.success){
          localStorage.removeItem("token"); //remove user-token
          welcomeview = document.getElementById("welcomeview");
          displayView(welcomeview); //display login page
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
}
