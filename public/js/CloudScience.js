
(function (window) {
    
    var KEYCODE_SPACE = 32;
    var KEYCODE_UP = 38;
    var KEYCODE_DOWN = 40;
    var KEYCODE_LEFT = 37;
    var KEYCODE_RIGHT = 39;
   
    
    var statusCanvas = null;
    var statusCanvasCtx = null;

    function CloudScience(stage, contentManager, gameWidth, gameHeight) {
        this.ninjaStage = stage;
        this.ninjaGameContentManager = contentManager;
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        

        var instance = this; // store the current context 

        document.onkeydown = function (e) {
            instance.handleKeyDown(e);
        };

        document.onkeyup = function (e) {
            instance.handleKeyUp(e);
        };

        this.Hero = new Player(this.ninjaGameContentManager.imgPlayer,  new Point(150, 150), true);
        this.ninjaStage.addChild(this.Hero);
       
        this.ninjaStage.update();
    };



    CloudScience.prototype.LoadUser = function(){


        var addedUser = new Player(this.ninjaGameContentManager.imgPlayer,  new Point(150, 150), false);
        this.ninjaStage.addChild(addedUser);
        this.ninjaStage.update();
        return addedUser;

    };

    CloudScience.prototype.RemoveUser = function(user){

        this.ninjaStage.removeChild(user);
        this.ninjaStage.update();
    };

    // Update logic callbacked by EaselJS
    CloudScience.prototype.tick = function () {
        try {  
                this.HandleInput();
        }
        catch (e) {
            console.log('Error', e);
        }
    };
    CloudScience.prototype.StartGame = function () {

        Ticker.addListener(this);
        // Targeting 60 FPS
        Ticker.setInterval(17);
    };

  
    CloudScience.prototype.HandleInput = function () {
        
        // update the stage:
        this.ninjaStage.update();
        
    };

 

    CloudScience.prototype.handleKeyDown = function (e) {
        
        //cross browser issues exist
        if (!e) { var e = window.event; }
        switch (e.keyCode) {
            case KEYCODE_UP: ;
                this.Hero.Ydirection = -1;
                $(this).trigger("startmove", [this.Hero]);
                break;
            case KEYCODE_LEFT:
                this.Hero.direction = -1;
                $(this).trigger("startmove", [this.Hero]);
                break;
            case KEYCODE_RIGHT:
                this.Hero.direction = 1;
                $(this).trigger("startmove", [this.Hero]);
                break;
            case KEYCODE_DOWN:
                this.Hero.Ydirection = 1;
                $(this).trigger("startmove", [this.Hero]);
                break;
                
        }
    };

    CloudScience.prototype.handleKeyUp = function (e) {
        
        //cross browser issues exist
        if (!e) { var e = window.event; }
        switch (e.keyCode) {
            case KEYCODE_UP: ;
                this.Hero.Ydirection = 0;
                 $(this).trigger("endmove", [this.Hero]);
                break;
            case KEYCODE_LEFT: ;
            case KEYCODE_RIGHT:
                this.Hero.direction = 0;
                $(this).trigger("endmove", [this.Hero]);
                break;
            case KEYCODE_DOWN:
                this.Hero.Ydirection = 0;
                 $(this).trigger("endmove", [this.Hero]);
                break;
            
        }
    };

    window.CloudScience = CloudScience;
} (window));