// register service worker

function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(function(registration) {
      console.log(registration);
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    })
    .catch(function(err) {
      console.log('ServiceWorker registration failed: ', err);
    });
  }
}

// function askPermission() {
//   return new Promise(function(resolve, reject) {
//     const permissionResult = Notification.requestPermission(function(result) {
//       resolve(result);
//     });
//
//     if (permissionResult) {
//       permissionResult.then(resolve, reject);
//     }
//   })
//   .then(function(permissionResult) {
//     if (permissionResult !== 'granted') {
//       throw new Error('We weren\'t granted permission.');
//     }
//   });
// }
//
// function subscribeUserToPush() {
//   return navigator.serviceWorker.register('service-worker.js')
//   .then(function(registration) {
//     const subscribeOptions = {
//       userVisibleOnly: true,
//       applicationServerKey: urlBase64ToUint8Array(
//         'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
//       )
//     };
//
//     return registration.pushManager.subscribe(subscribeOptions);
//   })
//   .then(function(pushSubscription) {
//     console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
//     return pushSubscription;
//   });
// }

// function for loading each image via XHR

function imgLoad(imgJSON) {
  // return a promise for an image loading
  return new Promise(function(resolve, reject) {
    var request = new XMLHttpRequest();
    request.open('GET', imgJSON.url);
    request.responseType = 'blob';

    request.onload = function() {
      if (request.status == 200) {
        var arrayResponse = [];
        arrayResponse[0] = request.response;
        arrayResponse[1] = imgJSON;
        resolve(arrayResponse);
      } else {
        reject(Error('Image didn\'t load successfully; error code:' + request.statusText));
      }
    };

    request.onerror = function() {
      reject(Error('There was a network error.'));
    };

    // Send the request
    request.send();
  });
}

var imgSection = document.querySelector('section');

window.onload = function() {
  var logEl = document.querySelector('.logs');
  function log(msg) {
    var p = document.createElement('p');
    p.textContent = msg;
    logEl.appendChild(p);
    console.log(msg);
  }
  
  registerServiceWorker();
  // load each set of image, alt text, name and caption
  for(var i = 0; i<=Gallery.images.length-1; i++) {
    imgLoad(Gallery.images[i]).then(function(arrayResponse) {

      var myImage = document.createElement('img');
      var myFigure = document.createElement('figure');
      var myCaption = document.createElement('caption');
      var imageURL = window.URL.createObjectURL(arrayResponse[0]);

      myImage.src = imageURL;
      myImage.setAttribute('alt', arrayResponse[1].alt);
      myCaption.innerHTML = '<strong>' + arrayResponse[1].name + '</strong>: Taken by ' + arrayResponse[1].credit;

      imgSection.appendChild(myFigure);
      myFigure.appendChild(myImage);
      myFigure.appendChild(myCaption);

    }, function(Error) {
      console.log(Error);
    });
  }
  
  document.querySelector('.push').addEventListener('click', function(event) {
    event.preventDefault();
    new Promise(function(resolve, reject) {
      Notification.requestPermission(function(result) {
        if (result !== 'granted') return reject(Error("Denied notification permission"));
        resolve();
      })
    }).then(function() {
      return navigator.serviceWorker.ready;
    }).then(function(reg) {
      return reg.sync.register('syncTest');
    }).then(function() {
      log(event.target.value);
    }).catch(function(err) {
      log('It broke');
      log(err.message);
    });
  });
};
