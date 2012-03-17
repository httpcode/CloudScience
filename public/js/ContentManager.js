

// Used to download all needed resources from our
// webserver
function ContentManager(stage, width, height) {
    // Method called back once all elements
    // have been downloaded
    var ondownloadcompleted;
    // Number of elements to download
    var NUM_ELEMENTS_TO_DOWNLOAD = 1;
    var numElementsLoaded = 0;

    var canPlayMp3;
    var canPlayOgg;

    var downloadProgress;

    
    // setting the callback method
    // Triggered once everything is ready to be drawned on the canvas
    this.SetDownloadCompleted = function (callbackMethod) {
        ondownloadcompleted = callbackMethod;
    };

    this.imgPlayer = new Image();
    

    // public method to launch the download process
    this.StartDownload = function () {

        SetDownloadParameters(this.imgPlayer, "/img/ninja.png");//"Player.png");
        
        Ticker.addListener(this);
        Ticker.setInterval(50);
    };

    function SetDownloadParameters(assetElement, url) {
        assetElement.src = url;
        assetElement.onload = handleElementLoad;
        assetElement.onerror = handleElementError;
    };

   
    // our global handler 
    function handleElementLoad(e) {
        numElementsLoaded++;

        // If all elements have been downloaded
        if (numElementsLoaded === NUM_ELEMENTS_TO_DOWNLOAD) {
            
            Ticker.removeAllListeners();
            numElementsLoaded = 0;
            
            ondownloadcompleted();
        }
    }

    //called if there is an error loading the image (usually due to a 404)
    function handleElementError(e) {
        console.log("Error Loading Asset : " + e.target.src);
    }

    // Update methid which simply shows the current % of download
    this.tick = function() {
       
        // update the stage:
        stage.update();
    };
}

