 ## Http Debounce Interceptor

 this module will just inject an interceptor to your module  that will intercept requests and only
 debounce those with config {shouldDebounce:true } , 
 by default it will debounce for 1 second (1000 mills).
 but you can override that by passing debounceTimeout with request configs.

 ## Installation 
> npm i ng-http-debounce --save

> bower i ng-http-debounce --save

## Usage 
the require it in you app module 

> &lt;script src="node_modules/ng-http-debounce/ng-http-debounce.js"&gt;&lt;/script&gt;

> &lt;script src="bower_components/ng-http-debounce/ng-http-debounce.js"&gt;&lt;/script&gt;

> app.module("myApp",["ngHttpDebounce"])

now if you have a case that requests same requests many time and you want to debounce it so it requests once from the server, but respond to all calls in separate 
such a case might arise if you are using multiple instances of  a component that request some data.

        // in directive / component <my-requester>
        $http.get(url, {shouldDebounce:true })

        //somewhere in your templates you use many instances like this, for some reason!
        <my-requester/>
        <my-requester/>
        <my-requester/>
        

now in this case the request will be sent once, and every one will get its own copy of the data.

