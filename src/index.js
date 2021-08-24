const publicKey = 'U2FsdGVkX19W3CTYPAe+wMrNZ3DdKGjju7DunK6HYSG7NdGMIDi0Z05APfVKhVy4KAtUutvOsQSnDLIGTQqLGg==';
const appUrl = 'https://apex-frontend-interviews.herokuapp.com/';
const contentDiv = document.getElementById('content');

const getLoginUrl = () => {
  const data = {
    scope: ["openid", "profile", "User.Read", "offline_access", "email"],
    token: publicKey,
  }
  
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
  };
  
  const redirectLink = fetch('https://apex-simple-sign-on.azurewebsites.net/okta/login/create', options);
  
  return redirectLink;
};

const parseJwt = (token) => {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};

const setCookie = (cname, cvalue, exdays) => {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname) => {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const validateToken = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const myParam = urlParams.get('access_token');
  if (myParam) {
    const jwt = parseJwt(myParam);
    if (jwt.app_displayname === 'apex-simple-ms-login') {
      setCookie('token', jwt, 1);
    }
    window.location = appUrl;
  }


  if (!getCookie('token')) {
    redirect();
  } else {
    contentDiv.style.visibility = 'visible';
  }
};

const startProcess = () => {
  validateToken();
};

const redirect = () => {
  getLoginUrl()  
    .then(response => response.json())
    .then(data => {
      window.location = data.login_url;
    });
};

document.addEventListener("DOMContentLoaded", function(){
  contentDiv.style.visibility = 'hidden';
  startProcess();
});