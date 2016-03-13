var myApp = angular.module('myApp', ['ngRoute', 'ngStorage'])

//***********************Routing**********************************
.config(function($routeProvider) {
    $routeProvider.when("/", {
        templateUrl: "html/index.html",
        controller: "indexCtrl"
    });

    $routeProvider.when("/recepr", {
        templateUrl: "html/myrecept.html",
        controller: "receprCtrl"
    });

    $routeProvider.when('/list', {
        templateUrl: 'html/list.html',
        controller: 'listCtrl'
    });

    $routeProvider.when("/newrecepr", {
        templateUrl: "html/newrecept.html",
        controller: "newreceprCtrl"
    });

    $routeProvider.when("/viewrecepr", {
        templateUrl: "html/viewrecept.html",
        controller: "viewrecepr"
    });

    $routeProvider.when("/index", {
        templateUrl: "html/index.html",
        controller: "indexCtrl"
    });

    $routeProvider.otherwise({
        redirectTo: '/'
    });

})


.run([function() {
    if (!localStorage.myReceptLocal) {
        localStorage.setItem('myReceptLocal', JSON.stringify([]))
    };
    if (!localStorage.myReceptShop) {
        localStorage.setItem('myReceptShop', JSON.stringify([]))
    }
    if (!localStorage.liked) {
        localStorage.setItem('liked', JSON.stringify([]))
    }
    if (!localStorage.planned) {
        localStorage.setItem('planned', JSON.stringify([]))
    }   
 
}])


//**********************controll Index ********************************
.controller('indexCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
    $http.get("https://jsonblob.com/api/jsonBlob/56c089b3e4b01190df4ef1ce").then(function(response) {
        
        $scope.myData = response.data.recipes;
        $scope.clickCarusel = function(recept) {
            $rootScope.receprCarusel = recept;
            $location.path('/newrecepr')
        }
    })
}])


//*******************controll myrecept.html ****************************

.controller('receprCtrl', ['$scope', '$location', '$localStorage', '$rootScope', function($scope, $location, $localStorage, $rootScope) {
    
    $scope.addNewRecept = function() {
        $location.path('/newrecepr')
    };

    $scope.viewrecept = function(recept, index) {
        $rootScope.index = index;
        $rootScope.receprView = recept;
        $location.path('/viewrecepr')
    }
    $scope.localDataRecept = JSON.parse(localStorage.myReceptLocal)
}])

//********************controll list.html******************************

.controller('listCtrl', ['$scope', '$location', '$localStorage', '$rootScope','$route', function($scope, $location, $localStorage, $rootScope,$route) {
    
    $scope.viewReceptShop = function() {

        $scope.myShop = JSON.parse(localStorage.myReceptShop)
    }
    $scope.likedRecept = JSON.parse(localStorage.liked)

    $scope.planned = JSON.parse(localStorage.planned)

    $scope.viewrecept = function(recept, index) {
        $rootScope.index = index
        recept.list = true
            //console.log(recept)
        $rootScope.receprView = recept;
        $location.path('/viewrecepr')
    }

    $scope.clearShop = function(){
        localStorage.setItem('myReceptShop', JSON.stringify([]))
        $route.reload();
    }

}])

//************************************************************************************************************
.controller('viewrecepr', ['$scope', '$location', '$localStorage', '$rootScope', function($scope, $location, $localStorage, $rootScope) {
    
    $scope.receprView = $rootScope.receprView;
    $scope.editMyRecept = function(title, url, description, instruction, ingridients) {
        $rootScope.receprCarusel = {
            "title": title,
            "photoUrl": url,
            "description": description,
            "instruction": instruction,
            "ingredients": ingridients
        };

        $rootScope.editFlag = 'Y';
        $location.path('/newrecepr')
    }

    $scope.shop = function() {
        var shopRecept = JSON.parse(localStorage.myReceptShop);
        for (var i = 0; i < $scope.receprView.ingredients.length; i++) {
            shopRecept.push($scope.receprView.ingredients[i])
        }

        localStorage.setItem('myReceptShop', JSON.stringify(shopRecept))

    }


    $scope.liked = function(title, url, description, instruction, ingridients) {
        $scope.receprView.liked = true
        var likedRecept = {
            "title": title,
            "photoUrl": url,
            "description": description,
            "instruction": instruction,
            "ingredients": ingridients,
            "liked": true
        };
        var likedLocal = JSON.parse(localStorage.liked)
        likedLocal.push(likedRecept)
        localStorage.setItem('liked', JSON.stringify(likedLocal))
            //
    }

    $scope.planned = function(title, url, description, instruction, ingridients) {

        $scope.receprView.planned = true
        var plannedRec = {
            "title": title,
            "photoUrl": url,
            "description": description,
            "instruction": instruction,
            "ingredients": ingridients,
            "planned": true
        };
        var plan = JSON.parse(localStorage.planned)
        plan.push(plannedRec)
        localStorage.setItem('planned', JSON.stringify(plan))
            //
    }

    $scope.delRecept = function(index) {
        if ($scope.receprView.liked) {
            var likedLocal = JSON.parse(localStorage.liked)
            likedLocal.splice($rootScope.index, 1)
            localStorage.setItem('liked', JSON.stringify(likedLocal))
            $location.path('/list')
        } else if ($scope.receprView.planned) {
            var plan = JSON.parse(localStorage.planned)
            plan.splice($rootScope.index, 1)
            localStorage.setItem('planned', JSON.stringify(plan))
            $location.path('/list')
        } else {
            var rec = JSON.parse(localStorage.myReceptLocal)
            var index = $rootScope.index
            rec.splice(index, 1)
            localStorage.setItem('myReceptLocal', JSON.stringify(rec))
            $location.path('/recepr')
        }

    }

}])

//**********************controll newrecept.html ************************

.controller('newreceprCtrl', ['$scope', '$localStorage', '$location', '$rootScope', function($scope, $localStorage, $location, $rootScope) {
    
    $scope.newReceprData = {};
    $scope.receprTitle = $rootScope.receprCarusel ? $rootScope.receprCarusel.title : "";
    $scope.receprDescription = $rootScope.receprCarusel ? $rootScope.receprCarusel.description : "";
    $scope.receprphotoUrl = $rootScope.receprCarusel ? $rootScope.receprCarusel.photoUrl : "";
    $scope.receptInstruction = $rootScope.receprCarusel ? $rootScope.receprCarusel.instruction : "";
    $rootScope.receptIngredients = $rootScope.receprCarusel ? $rootScope.receprCarusel.ingredients : [, , , ];

    $rootScope.receprCarusel = "";

    $scope.addNewReceptLocal = function() {

        var arrayingridients = []
        var ingridients = document.querySelectorAll(".ingr")
        for (var i = 0; i < ingridients.length; i++) {
            arrayingridients.push(ingridients[i].value)
        }

        var newReceptLocal = JSON.parse(localStorage.myReceptLocal);
        $scope.newReceprData.title = $scope.receprTitle;
        $scope.newReceprData.description = $scope.receprDescription;
        $scope.newReceprData.photoUrl = $scope.receprphotoUrl;
        $scope.newReceprData.receptTime = $scope.receptTime;
        $scope.newReceprData.ingredients = arrayingridients;
        $scope.newReceprData.instruction = $scope.receptInstruction;
        newReceptLocal.push($scope.newReceprData)


        if ($rootScope.editFlag !== 'Y') {
            localStorage.setItem('myReceptLocal', JSON.stringify(newReceptLocal))
        } else {
            $rootScope.editFlag = 'N'
            var myReceptLocal = JSON.parse(localStorage.myReceptLocal)
            myReceptLocal[$rootScope.index].title = $scope.receprTitle;
            myReceptLocal[$rootScope.index].description = $scope.receprDescription;
            myReceptLocal[$rootScope.index].photoUrl = $scope.receprphotoUrl;
            myReceptLocal[$rootScope.index].receptTime = $scope.receptTime;
            myReceptLocal[$rootScope.index].ingredients = arrayingridients;
            myReceptLocal[$rootScope.index].instruction = $scope.receptInstruction;

            localStorage.setItem('myReceptLocal', JSON.stringify(myReceptLocal))
        }

        $location.path('/recepr')
    }

    $scope.addNewInput = function() {
        var arrayingridients = []
        var ingridients = document.querySelectorAll(".ingr")
        for (var i = 0; i < ingridients.length; i++) {
            arrayingridients.push(ingridients[i].value)
        }
        $rootScope.receptIngredients = arrayingridients
        $rootScope.receptIngredients.push('')
    }

    $scope.getError = function(error) {
        if (error.required) {
            return "Поле не должно быть пустым"
        } else if (error.url) {
            return "Введите корректный URL"
        } else if (error.maxlength) {
            return "Превышено допустимое количество символов"
        }

    }

    $scope.removeIngridient = function(item, index) {
        $rootScope.receptIngredients.splice(index, 1)

    }
}])


.filter('formatText', function() {
    return function(instruction) {
        if (instruction) {
            return $(instruction).text()
        }


    }
})

.filter('dotdotdot', function() {
    return function(text) {
        if (text) {
            return text + " ..."
        }


    }
})

.directive('caruselStart', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            element.carousel()
        }
    }
})

.directive('underline', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            element.mouseenter(function() {
                $(this).css('text-decoration', 'underline')
            })

            element.mouseleave(function() {
                $(this).css('text-decoration', 'none')
            })
        }
    }
})

.directive('deletefreehostingzzz', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var zzz = document.querySelectorAll(".cbalink")
            for(var i=0;i<zzz.length;i++){
            zzz[i].remove()
    }   
        }
    }
})