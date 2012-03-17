$(function(){

   if (Modernizr.canvas) {
    var usersOnPage = new Array();
    var canvas = document.getElementById("ninjaCanvas");
    var globalCanvasContext = canvas.getContext("2d");

    // create a new stage and point it at our canvas:
    var stage = new Stage(canvas);

    
    var contentManager = new ContentManager(stage, canvas.width, canvas.height);
    contentManager.SetDownloadCompleted(startGame);
    contentManager.StartDownload();

    function startGame(){

        var cs = new CloudScience(stage, contentManager, canvas.width, canvas.height, usersOnPage);
        cs.StartGame();

        var socket = io.connect('http://ninja.learnweaver.net:8081');
        
        socket.on('newuser', function (data) {
            var user = cs.LoadUser();
            user.name = data.id;
            usersOnPage.push(user);
            
         });

        socket.on('userleave', function (data) {
            
            $.each(usersOnPage, function(key,usr){

                    if(usr.name == data.id){
                        cs.RemoveUser(usr);
                        usersOnPage.pop(usr);
                    }

            });
        });

        socket.on("getconnected", function(data){

                
               
                for(var newClient in data.ids){
                    
                    var usrId = data.ids[newClient];
                    
                        var user = cs.LoadUser();
                        user.name = usrId;
                        usersOnPage.push(user);
                        
                }
                

        });

        socket.on("usermoved", function (data) {
            
            $.each(usersOnPage, function(key,usr){

                    if(usr.name == data.id){
                        usr.direction = data.direction;
                        usr.Ydirection = data.Ydirection;
                        usr.Reset({x: data.x, y: data.y});
                    }

            });

        });

        $(cs).bind("endmove", function(data){
            socket.emit('usermove', { x: data.target.Hero.x, y: data.target.Hero.y, direction: data.target.Hero.direction, Ydirection: data.target.Hero.Ydirection });
        })

        $(cs).bind("startmove", function(data){
            socket.emit('usermove', { x: data.target.Hero.x, y: data.target.Hero.y, direction: data.target.Hero.direction, Ydirection: data.target.Hero.Ydirection });
        })

          
    }

    
   }
 
})