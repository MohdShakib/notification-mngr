import apiConfig from '../config/apiConfig'
import apiService from './apiService'

function getScript(uri, callback) {
  var h = document.getElementsByTagName('head')[0], s = document.createElement('script');
  s.async = true; s.src = uri;
  s.onload = s.onreadystatechange = function () {
    if (!s.readyState || /loaded|complete/.test(s.readyState)) {
      s.onload = s.onreadystatechange = null; if (h && s.parentNode) { h.removeChild(s) } s = undefined;
      if (callback) { callback() }
    }
  };
  h.insertBefore(s, h.firstChild);
}

var gPlus = (function() {
    var auth2, googleUser;

    let gPlusAppId = '547333527494-eh5qj6v8g19429teuijtr333infkvk8n';
    //let gPlusRedirectUri = 'http://ntf.makaan-ws.com:9900/';

    return {
        load: function() {
            getScript("//plus.google.com/js/client:plusone.js", function() {
                if (gapi.auth2 && gapi.auth2.getAuthInstance()) {
                    auth2 = gapi.auth2.getAuthInstance();
                } else {
                    gapi.load('auth2', function() {
                        gapi.auth2.init({
                            client_id: `${gPlusAppId}.apps.googleusercontent.com`,
                            scope: 'profile',
                            //redirect_uri: gPlusRedirectUri
                        }).then(() => {
                                auth2 = gapi.auth2.getAuthInstance();
                            }, (error) => {
                                console.log(error);
                        });
                    });
                }
            });
        },
        login: function() {
            var that = this;
            var gPlusrepeater = setInterval(function() {
                if (auth2) {
                    clearInterval(gPlusrepeater);
                    auth2.isSignedIn.listen(that.signInCallback);
                    auth2.then(that.signInCallback());
                    if (!auth2.isSignedIn.get()) {
                        auth2.signIn();
                    }else {
                    }
                }
            }, 1000);
        },
        signInCallback: function() {
            var authResult = gapi.auth2.getAuthInstance();
            if (auth2.isSignedIn.get()) {
                googleUser = auth2.currentUser.get();
                var token = googleUser.getAuthResponse().access_token;
                internalLoginCall('google', token).then(()=>{
                    location.href = location.href;
                }, ()=>{
                });
            }else{

            }
        }
    };
})();


function internalLoginCall(provider, token){
    var loginData = {
        'access_token': token
    };

    let url = apiConfig.apiHandlers.socialLoginApi(provider).url;
    return apiService.post(url, loginData, {
        baseURL: '/'
    }).then((response)=>{
        console.log('internalLoginCall success: ', response);
        return response;
    }, (error)=>{
        throw error;
    });
}

function userLogout(){
    return apiService.post(apiConfig.apiHandlers.userLogout().url, null, {
        baseURL: '/'
    }).then((response) => {
        return response;
    }, (error) => {
        throw error;
    });
}

function isUserLoggedIn(){
    return apiService.get(apiConfig.apiHandlers.userDetails().url, {
        baseURL: '/'
    }).then((response) => {
        return response;
    }, (error) => {
        throw error;
    });
}

module.exports = {
    gPlus,
    userLogout,
    isUserLoggedIn
}
