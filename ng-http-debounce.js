(function () {

    /**
     * @description simply pass a flag with your http request , shouldDebounce:true where ever yuo feel this request get called many time with same 
     *              data. (may happen with some really needed change reactions or any other cases ! ) 
     *              $http.get(url,{shouldDebounce:true[,debounceTimeout:1000] }) 
     */
    angular
        .module("ngHttpDebounce", [])
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push("HttpDebounce");
        })
        .factory("HttpDebounceService", HttpDebounceService);

    HttpDebounceService.$inject = ["$q", "$injector"];
    function HttpDebounceService($q, $injector) {

        var pendingRequests = {};

        //simple hash function
        function hash(str) {
            var hash = 5381,
                i = str.length;

            while (i) {
                hash = (hash * 33) ^ str.charCodeAt(--i);
            }
            return hash >>> 0;
        }
        
        var responseError = function (config) {
            if (config.scheduled) {
                return $q.when(config.promise);
            }
            return $q.reject(config);
        };

        var request = function (config) {
            if (!config.shouldDebounce) return config;
            var h = hash(JSON.stringify(config));
            pendingRequests[h] = pendingRequests[h] || {
                config: config,
                promises: [],
                timeout: ""
            };
            var defer = $q.defer();
            if (pendingRequests[h] && pendingRequests[h].timeout) {
                clearTimeout(pendingRequests[h].timeout);
            }
            pendingRequests[h].timeout = setTimeout(function () {
                var http = $injector.get("$http");
                angular.extend(config, {
                    shouldDebounce: false
                });
                http(config).then(function (res) {
                    pendingRequests[h].promises.forEach(function (p) {
                        p.resolve(res);
                    });
                    pendingRequests[h] = undefined;
                });
            }, config.debounceTimeout || 1000);

            pendingRequests[h].promises.push(defer);
            return $q.reject({
                scheduled: true,
                promise: defer.promise
            });
        };

        return {
            responseError: responseError,
            request: request
        };
    }
})();