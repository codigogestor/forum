angular.module('App',['ngRoute']);


angular.module('App').config(function($routeProvider){


    $routeProvider.when('/home',{
        templateUrl: "view/home.html",
        controller: "MainController",
        resolve:{
            routeName:function(){
                return "Home";
            }
        }
    });

    $routeProvider.when('/topicos',{
        templateUrl: "view/topicos.html",
        controller: "TopicosController",
        resolve:{
            routeName:function(){
                return "Tópicos";
            }
        }
    });
    $routeProvider.when('/novo-topico',{
        templateUrl: "view/novo-topico.html",
        controller: "NovoTopicoController",
        resolve:{
            routeName:function(){
                return "Novo Tópico";
            }
        }
    });

    $routeProvider.when('/topico/:id',{
        templateUrl: "view/topico.html",
        controller: "TopicoController",
        resolve:{
            routeName:function(){
                return "Novo Tópico";
            }
        }
    });

    $routeProvider.otherwise({redirectTo:"/home"});

});


angular.module('App').controller('MainController',function($scope,$http,routeName){

    $scope.title = "Main Controller";
    $scope.routeName = routeName;

    localStorage.clear();


    $(document).on('submit','form[name=fazer-login]',function(e){
        e.preventDefault();

        var email = $('form[name=fazer-login] input[name=email]').val();

        $http.get("http://localhost:3000/api/v1/user?email=" + email).then(function(response) {
            console.log(response);

            if(response.data.status=='SUCCESS'){
                localStorage.setItem("kanamobi_session_id", response.data.data[0].id);
                localStorage.setItem("kanamobi_session_name", response.data.data[0].name);
                document.location.href = "#!topicos";
            } else {
                alert(response.data.message);
            }
        });

    });

    $(document).on('submit','form[name=novo-cadastro]',function(e){

        e.preventDefault();

        var data = {
            name: $('form[name=novo-cadastro] input[name=name]').val(),
            email: $('form[name=novo-cadastro] input[name=email]').val()
        }

        $http.post("http://localhost:3000/api/v1/user",data).then(function(response) {
            console.log(response);
            if(response.data.status=='SUCCESS'){
                localStorage.setItem("kanamobi_session_id", response.data.data.id);
                localStorage.setItem("kanamobi_session_name", response.data.data.name);
                document.location.href = "#!topicos";
            } else {
                alert(response.data.message);
            }
        });


    });


});

angular.module('App').controller('TopicosController',function($scope,$http,routeName){
    $scope.title = "Topicos Controller";
    $scope.routeName = routeName;

    if(!localStorage.getItem('kanamobi_session_id')){
        document.location.href = "#!home";
    }

    $http.get("http://localhost:3000/api/v1/topic").then(function(response) {
        $scope.topicos = response.data.data;
        console.log(response.data);
    });


});

angular.module('App').controller('NovoTopicoController',function($scope,$http,routeName){

    $scope.title = "Novo Tópico Controller";
    $scope.routeName = routeName;

    if(!localStorage.getItem('kanamobi_session_id')){
        document.location.href = "#!home";
    }


    $(document).on('submit','form[name=adicionar-topico]',function(e){
        e.preventDefault();

        var data = {
            title: $('input[name=title]').val(),
            description: $('textarea[name=description]').val(),
            tag: $('select[name=tag] :selected').val(),
            user_id: localStorage.getItem('kanamobi_session_id'),
            user_name: localStorage.getItem('kanamobi_session_name')
        }

        $http.post("http://localhost:3000/api/v1/topic",data).then(function(response) {
            console.log(response);
            alert(response.data.message);
            if(response.data.status=='SUCCESS')
                document.location.href = "#!topico/" + response.data.data.id;
        });


    });

});


angular.module('App').controller('TopicoController',function($scope,$http,routeName, $routeParams){

    if(!localStorage.getItem('kanamobi_session_id')){
        document.location.href = "#!home";
    }

    $http.get("http://localhost:3000/api/v1/topic/" + $routeParams.id).then(function(response) {

        $scope.topicoId = response.data.data.id;
        $scope.topicoTitle = response.data.data.title;
        $scope.topicoDescription = response.data.data.description;
        $scope.topicoTag = response.data.data.tag;
        $scope.topicoAuthor = response.data.data.user_name;
        $scope.topicoDate = response.data.data.created_at;

        console.log($scope.topicoTitle );

    });


    $http.get("http://localhost:3000/api/v1/comment?topic_id=" + $routeParams.id).then(function(response) {
        $scope.comments = response.data.data;
        console.log($scope.comments);


        $http.get("http://localhost:3000/api/v1/rating").then(function(response) {
            var rating = response.data.data;
            $scope.rating = rating;


            for(var i=0; i<rating.length; i++){
                console.log(rating[i]['comment_id']);

                $('.comentario p#comentario-' + rating[i]['comment_id'] + ' button[data-status='+rating[i]['status']+']').attr('disabled',true);
                $('.comentario p#comentario-' + rating[i]['comment_id'] + ' button').attr('data-rating',rating[i]['id']);
            }

        });


    });





    $(document).on('submit','form[name=adicionar-comentario]',function(e){
        e.preventDefault();
        var data = {
            topic_id: $routeParams.id,
            text: $('form[name=adicionar-comentario] input[name=text]').val(),
            user_id: localStorage.getItem('kanamobi_session_id'),
            user_name: localStorage.getItem('kanamobi_session_name')
        }
        $http.post("http://localhost:3000/api/v1/comment",data).then(function(response) {
            console.log(response);
            alert(response.data.message);
            if(response.data.status=='SUCCESS')
                location.reload();
        });
    });


    $(document).on('click','button.aprovar-comentario, button.reprovar-comentario',function(e){
        e.preventDefault();
        var data = {
            comment_id: $(this).attr('data-id'),
            status: $(this).attr('data-status'),
            user_id: localStorage.getItem('kanamobi_session_id')
        }

        if($(this).attr('data-rating') != ''){
            $http.delete("http://localhost:3000/api/v1/rating/"+$(this).attr('data-rating')).then(function(response) {
                console.log(response);
            });
        }

        $http.post("http://localhost:3000/api/v1/rating",data).then(function(response) {
            console.log(response);
            alert(response.data.message);
            if(response.data.status=='SUCCESS')
                location.reload();
        });
    });


});
