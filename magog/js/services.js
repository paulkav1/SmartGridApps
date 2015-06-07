// Get data from the REST service for the given ID
// If we have it cached don't go again
app.service('DataModel', function($http, $q) {
    var model = this;
    var cache;
    var cacheId;
    var APIHOME;
    if (window.location.hostname === 'localhost')
        APIHOME = "http://localhost:8080/api/";
    else
        APIHOME = "http://smartgridtools-pakra.rhcloud.com/api/";


    model.getData = function(id) {
        if (id === cacheId)
            return $q.when(cache);
        else{
            var httpStr = APIHOME + "magog/" + id;
            return $http.get(httpStr).then(
                function (response) {
                    cache = response.data;
                    cacheId = id;
                    return cache;
                },
                function (data) {
                    alert("problem with back-end http call to " + httpStr);
                });
        };
    };
});
