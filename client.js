
var welcomeview;
var profileview;
var passWrdLen = 3;
var userToken = "";
var psw = "";


displayView = function(view){
// the code required to display a view
  document.getElementById("displayWindow").innerHTML = view.innerHTML;
};

window.onload = function(){
//code that is executed as the page is loaded.
//You shall put your own custom code here.
//window.alert() is not allowed to be used in your implementation.
  welcomeview = document.getElementById("welcomeview");
  profileview = document.getElementById("profileview");
  displayView(welcomeview);
};

function activeTab(id){
  var homeTab = document.getElementById("HomeTab");
  var browseTab = document.getElementById("BrowseTab");
  var accTab = document.getElementById("AccTab");

  var homeBtn = document.getElementById("HomeBtn");
  var browseBtn = document.getElementById("BrowseBtn");
  var accBtn = document.getElementById("AccBtn");


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
  var username = document.getElementById("email").value;
  psw = document.getElementById("psw").value;
  var logInMessage = document.getElementById("logInMessage");

  var user = serverstub.signIn(username, psw);

  if(user.success == true){
    // Get user token and display view
    displayView(profileview);
    userToken = user.data;
    getUserData(userToken);

  }else{
    logInMessage.innerHTML = user.message;
  }
}


function signUp(){
  var emailSignUp = document.getElementById("email-signUp").value;
  var nameSignUp  = document.getElementById("name-signUp").value;
  var famSignUp = document.getElementById("fam-signUp").value;
  var gender = document.getElementById("gender").value;
  var city = document.getElementById("city").value;
  var country = document.getElementById("country").value;

// Check requirements for password
  var password = document.getElementById("psw-signUp").value;
  var passwordRpt = document.getElementById("pswRpt").value;
  var psw_len = document.getElementById("psw_len");
  var psw_match = document.getElementById("psw_match");

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
    // Sign up user if all fields are correct
    var newUser = {
      "email":emailSignUp,
      "password":password,
      "firstname":nameSignUp,
      "familyname":famSignUp,
      "gender":gender,
      "city":city,
      "country":country
    }
    var newUserProfile = serverstub.signUp(newUser);
    var message = document.getElementById("message");

    message.innerHTML = newUserProfile.message;
  }
}

function pswChange(){
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
    else if(oldPsw != psw){
      message.innerHTML = "Old password not correct!";
    }
    else{
      serverstub.changePassword(userToken, oldPsw, changePsw);
      message.innerHTML = "password changed";
    }
}

function getUserData(userToken){

// returns the object containing firstname, familyname etc...
  var getUser = serverstub.getUserDataByToken(userToken);
  var userData = getUser.data;
  // mst funka
  if(getUser.success == true){
    document.getElementById("nameLabel").innerHTML =   "Name:   " + userData.firstname + " " + userData.familyname;
    document.getElementById("genderLabel").innerHTML = "Gender: " + userData.gender;
    document.getElementById("cityLabel").innerHTML =   "City:   " + userData.city;
    document.getElementById("countryLabel").innerHTML ="Country: " + userData.country;
    document.getElementById("emailLabel").innerHTML =  "Email:  " + userData.email;

  }
}

function postWall(){
  //Get user info
  var getUser = serverstub.getUserDataByToken(userToken);
  var userData = getUser.data;
  var email = userData.email;
  // Save post
  var messWall = document.getElementById("pMess");
  var newPost = document.getElementById("postBox").value;
  var postMess = serverstub.postMessage(userToken, newPost, email);

  messWall.innerHTML = postMess.message;

}


function displayWall(){

  var getMessages = serverstub.getUserMessagesByToken(userToken);
  if (getMessages.success == true){
    var messages = getMessages.data;
    document.getElementById("wall").innerHTML = null;

    for(i = 0; i < messages.length; i++){
      document.getElementById("wall").innerHTML += "<p>From: " + messages[i].writer + "<br>";
      document.getElementById("wall").innerHTML += messages[i].content + "<br></p>" ;
    }
  }
}

function loadMessages(){
  var email = document.getElementById("browseuser").value;
  var getMessages = serverstub.getUserMessagesByEmail(userToken, email);

  if (getMessages.success == true){
    var messages = getMessages.data;
    document.getElementById("messageWall").innerHTML = null;

    for(i = 0; i < messages.length; i++){
      document.getElementById("messageWall").innerHTML += "<p>From: " + messages[i].writer + "<br>";
      document.getElementById("messageWall").innerHTML += messages[i].content + "<br></p>" ;
    }
  }
}


function browseUser(){

  var email = document.getElementById("browseuser").value;
   var userInfo = serverstub.getUserDataByEmail(userToken, email);

   if (userInfo.success == true) {
     var browseUserInfo = document.getElementById("browseUserInfo");
     var browseUserBlock = document.getElementById("browseUser");
     //Display right view
     browseUserInfo.style.display = "block";
     browseUserBlock.style.display = "none";

     var userData = userInfo.data;

    document.getElementById("nameBr").innerHTML =   "Name:   " + userData.firstname + " " + userData.familyname;
    document.getElementById("genderBr").innerHTML = "Gender: " + userData.gender;
    document.getElementById("cityBr").innerHTML =   "City:   " + userData.city;
    document.getElementById("countryBr").innerHTML ="Country: " + userData.country;
    document.getElementById("emailBr").innerHTML =  "Email:  " + userData.email;
    loadMessages();
   } else {
     var data = userInfo.message;
     document.getElementById("errorSearch").innerHTML = data;
   }

}

function postOnUserWall(){
  //Get user info
  var email = document.getElementById("browseuser");
  
  var getUser = serverstub.getUserDataByEmail(userToken,email);  //getUserDataByToken(userToken);
  var userData = getUser.data;
  // Save post
  var messWall = document.getElementById("feedbackBox");
  var newPost = document.getElementById("postBoxBrowse").value;
  var postMess = serverstub.postMessage(userToken, newPost, email);

  newPost.innerHTML = postMess.message;
  displayOnUserWall();

}

function displayOnUserWall(){
  var email = document.getElementById("browseuser");
  var getMessages = serverstub.getUserMessagesByEmail(userToken,email)
  if (getMessages.success == true){
    var messages = getMessages.data;
    document.getElementById("messageWall").innerHTML = null;

    for(i = 0; i < messages.length; i++){
      document.getElementById("messageWall").innerHTML += "<p>From: " + messages[i].writer + "<br>";
      document.getElementById("messageWall").innerHTML += messages[i].content + "<br></p>" ;
    }
  }
}

function signOut(){
  serverstub.signOut(userToken);
  displayView(welcomeview);
}
