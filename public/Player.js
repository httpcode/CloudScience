Array.matrix = function (m, n, initial) {
    var a, i, j, mat = [];
    for (i = 0; i < m; i += 1) {
        a = [];
        for (j = 0; j < n; j += 1) {
            a[j] = initial;
        }
        mat[i] = a;
    }
    return mat;
};

Math.clamp = function(value, min, max) {
      value = value > max ? max : value;
      value = value < min ? min : value;
      return value;
};


(function (window) {
    // Constants for controling horizontal movement
    var MoveAcceleration = 13000.0;
    var MaxMoveSpeed = 1750.0;
    var GroundDragFactor = 0.48;

    var isLocal = false;

    var globalTargetFPS = 17;

    function Player(imgPlayer, position, local) {
        this.initialize(imgPlayer, position,local);
    }

    // Using EaselJS BitmapSequence as the based prototype
    Player.prototype = new BitmapSequence();

    // constructor:
    //unique to avoid overiding base class
    Player.prototype.BitmapSequence_initialize = Player.prototype.initialize;
    Player.prototype.BitmapSequence_tick = Player.prototype.tick;



    Player.prototype.initialize = function (imgPlayer, position, local) {
        var width;
        var left;
        var height;
        var top;

        /*var localSpriteSheet = new SpriteSheet(
            imgPlayer, //image to use
            64, //width of each sprite
            64, //height of each sprite
            {
            walk_left: [0, 9],
            idle: [44, 44]
        });*/

        var localSpriteSheet = new SpriteSheet(
            imgPlayer, //image to use
            68, //width of each sprite
            100, //height of each sprite
            {
            walk_left: [1, 3],
            idle: [0, 0]
        });

       localSpriteSheet = SpriteSheetUtils.flip(
            localSpriteSheet,
            {
                walk_right: ["walk_left", true, false]
            });

        this.BitmapSequence_initialize(localSpriteSheet);


        this.position = position;
        this.velocity = new Point(0, 0);
        this.isLocal = local;
        this.elapsed = 0;


        this.name = "You";

        // 1 = right & -1 = left & 0 = idle
        this.direction = 0;
        this.Ydirection = 0;


        this.Reset(position);
    };

    /// <summary>
    /// Resets the player to life.
    /// </summary>
    /// <param name="position">The position to come to life at.</param>
    Player.prototype.Reset = function (position) {
        this.x = position.x;
        this.y = position.y;
        this.velocity = new Point(0, 0);
        
        this.gotoAndPlay("idle");

    };

    Player.prototype.ApplyPhysics = function () {
        
        var previousPosition = new Point(this.x, this.y);

        // Base velocity is a combination of horizontal movement control and
        // acceleration downward due to gravity.
        this.velocity.x += this.direction * MoveAcceleration * this.elapsed;
        this.velocity.y += this.Ydirection * MoveAcceleration * this.elapsed;; 

        this.velocity.x *= GroundDragFactor;
        this.velocity.y *= GroundDragFactor;
        
        // Prevent the player from running faster than his top speed.
        this.velocity.x = Math.clamp(this.velocity.x, -MaxMoveSpeed, MaxMoveSpeed);
        this.velocity.y = Math.clamp(this.velocity.y, -MaxMoveSpeed, MaxMoveSpeed);

        this.x += this.velocity.x * this.elapsed;
        this.y += this.velocity.y * this.elapsed;
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);

     
        // If the collision stopped us from moving, reset the velocity to zero.
        if (this.x === previousPosition.x) {
            this.velocity.x = 0;
        }

        if (this.y === previousPosition.y) {
            this.velocity.y = 0;
        }
        
    };

    /// <summary>
    /// Handles input, performs physics, and animates the player sprite.
    /// </summary>
    /// <remarks>
    /// We pass in all of the input states so that our game is only polling the hardware
    /// once per frame. We also pass the game's orientation because when using the accelerometer,
    /// we need to reverse our motion when the orientation is in the LandscapeRight orientation.
    /// </remarks>
    Player.prototype.tick = function () {
        // It not possible to have a predictable tick/update time
        // requestAnimationFrame could help but is currently not widely and properly supported by browsers
        // this.elapsed = (Ticker.getTime() - this.lastUpdate) / 1000;
        // We're then forcing/simulating a perfect world
        this.elapsed = globalTargetFPS / 1000;
        
        this.ApplyPhysics();
        
        if (Math.abs(this.velocity.x) - 0.02 > 0) {
            // Checking if we're not already playing the animation
            if (this.currentSequence.indexOf("walk_left") === -1 && this.direction === -1) {
                this.gotoAndPlay("walk_left");
            }
            if (this.currentSequence.indexOf("walk_right") === -1 && this.direction === 1) {
                this.gotoAndPlay("walk_right");
            }
        }
        else {
            if (this.currentSequence.indexOf("idle") === -1 && this.direction === 0) {
                this.gotoAndPlay("idle");
            }
        }
        

        // To slow down the animation loop of the sprite, we're not redrawing during each tick
        // With a Modulo 4, we're dividing the speed by 4
        var speedControl = Ticker.getTicks() % 4;

        if (speedControl == 0) {
            this.BitmapSequence_tick();
        }
    };

    window.Player = Player;
} (window));

