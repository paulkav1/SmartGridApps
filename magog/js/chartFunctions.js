function getTypes($scope){
    var typeMap = {};
    var data = [];

    for (i = 0; i < $scope.rows.length; i++){
        var type = $scope.rows[i].type;
        if (type in typeMap)
            typeMap[type] += 1;
        else
            typeMap[type] = 1;
    }

    for (var key in typeMap){
        var datum = {name: key, value: typeMap[key]};
        data.push(datum);
    }

    return data;
}
