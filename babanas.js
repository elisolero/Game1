function startGame(){

    var checker = false;
    var topPipe;
    var bottomPipe;
    var mousePos;

    var scoreCounter = 0;
    var score = document.getElementById("score");
    score.innerText = scoreCounter;


    var canvas = document.getElementById("canvas"),
    stage = new createjs.StageGL(canvas, {antialias:true,transparent:true});
    // stage.setClearColor("#ccc");
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    // createjs.Ticker.interval = 25;
    createjs.Touch.enable(stage, false, true);
    // debugger;
    var cont = stage.addChild(new createjs.Container())
    // .set({mouseEnabled:false, mouseChildren:false});

    addBottomGate();
    addTopGate();

    // Load the banana
    var img = document.createElement("img");
    // img.crossOrigin = "Anonymous";
    img.src = "./banana.png";
    img.onload = init;
    var bmp = new createjs.Bitmap(img);
    handleResize();

    var MAX_BANANAS = 300;

    var bananas = [];
    function init() {
    createjs.Ticker.on("tick", tick);
    // for (var i=0; i<100; i++) { tick(); }
    }

    var cached;
    var counter = 0;
    // Tick Code
    var clicked = false;


    function tick(event) {
                if (counter % 7 === 0) {
                    addBanana();  
                }
                counter++;
                
                var factor = 1,
                    DIST = canvas.width/10,
                    ADD = 10;
                // if (clicked) {
                //     factor = 5;
                //     DIST = canvas.width/5;
                // }
                
                for (var i=bananas.length-1; i>=0; i--) {
                    // debugger;
                    var b = bananas[i];
                    b.y -= b.speed;
                    // var num = (b.y > canvas.height / 2) ? 0.002 : -0.002;
                    // b.x -= b.x * num;

                    b.rotation = (b.rotation + b.rotationSpeed) % 360;
                    // b.speed *= 1.01;
                    
                    b.x += b.addX; // Add burst speed
                    b.y += b.addY;
                    // b.addX *= 0.9; // Slow down the burst speed
                    if (b.addY > 0) { b.addY *= 0.9; }
                    
                    // var difX = stage.mouseX-b.x,
                    //     difY = stage.mouseY-b.y,
                    //     dist = Math.sqrt(difX*difX + difY*difY);
                    // if (Math.abs(dist) < DIST) {
                    // if (clicked) { b.rotationSpeed *= -difX/DIST * 10; }
                    // b.addX = -difX/DIST * ADD* (b.scale) * factor;
                    // b.addY = -difY/DIST * ADD* (b.scale) * factor;
                    // }
                    
                    // if (b.y > canvas.height+30) {
                        // addBanana(b, i); // Reset banana
                    // }

                    if (b.y <= 0) {
                        // bananas[i]
                        // debugger;

                        // b.parent.removeChildAt(b.id)
                        // stage.removeChild(b)
                        bananas.splice(i,1);
                        b.parent.removeChild(b)
                        scoreCounter++;
                        score.innerText = scoreCounter;
                        // debugger;
                        // addBanana(b, i); // Reset banana
                    }
                }
                clicked = false;
                stage.update(event);
    }

    function addBanana(b) {
        if (b) {
            // Nothing, its banana reuse
        }
        //  else if (bananas.length > MAX_BANANAS){
        //     return; // Too many bananas
        // } 
        else {

            // Make a new banana
            b = new createjs.Bitmap(img).set({
            regX: img.naturalWidth/2,
            regY: img.naturalHeight/2
            });
            bananas.push(b);
            cont.addChild(b);
        }
        // debugger;
        // Reset banana props
        var max = 5;
        var min = 4;
        var speed = Math.random() * (max - min + 1) + min;
        var xPlace = (mousePos) ? mousePos.x :  canvas.width/2;
        // console.log();
        // debugger;
        b.set({
            x: xPlace,
            y: bottomPipe.y + bottomPipe.image.height * 0.1,
            speed: speed, //Math.random() * 8 + 1.5,
            rotation: Math.random() * 360,
            rotationSpeed: Math.random() * 3 - 1.5,
            addX: 0,
            addY: 0,
            power: 0
        });
        // debugger;

        // if(b.speed < 5){
        //     b.scale =1;
        // }else{
            b.scale = b.speed/6.5;
        // }
        // Speed is a factor of scale
    }

    function addBottomGateRectangle(){
        var r = 64;
        var graphics = new createjs.Graphics();
        graphics.beginFill("#FF0099")
          .drawCircle(0,0, r)
          .endFill();
      
        cached = new createjs.Shape(graphics);
        cont.addChild(cached);
        cached.x = canvas.width / 2;
        cached.y = canvas.height / 2;
        cached.cache(-r,-r, r*2,r*2);        
    }
    
    function addBottomGate(){
        var img = document.createElement("img");
        // img.crossOrigin = "Anonymous";
        img.src = "./pipeline.svg";
        img.onload = init;

        let PRECENT = window.innerWidth * 0.3;
        PRECENT = (PRECENT < 250) ? PRECENT : 250;
        img.width = PRECENT
        img.height = PRECENT * 2

        var bmp = new createjs.Bitmap(img);
        var xPlace = (mousePos) ? mousePos.x :  window.innerWidth/2 - bmp.image.width/2

        cont.addChild(bmp);
        bmp.set({
            x: xPlace,
            y: window.innerHeight  - bmp.image.height * 0.6,
            rotation:10,
        });   
        bottomPipe =  bmp;  
    }

    function addTopGate(){
        var img = document.createElement("img");
        // img.crossOrigin = "Anonymous";
        img.src = "./pipeline.svg";
        img.onload = init;

        let PRECENT = window.innerWidth * 0.3;
        PRECENT = (PRECENT < 250) ? PRECENT : 250;
        img.width = PRECENT
        img.height = PRECENT * 2

        var bmp = new createjs.Bitmap(img);

        cont.addChild(bmp);
        bmp.set({
            x: window.innerWidth/2 + (img.width/2),
            y:  bmp.image.height * 0.41,
            rotation:200,
        });   
        topPipe =  bmp;         

    }

    // Resize Code
    window.addEventListener("resize", handleResize, false);
    function handleResize(event) {
        // debugger;
    var w = window.innerWidth,
        h = window.innerHeight;
    canvas.width = w; canvas.height = h;
    stage.updateViewport(w,h);
    // Layout other assets
    stage.update();

    }

    stage.on("stagemousedown", function() { 
        console.log("stagemousedown");
     })

    stage.addEventListener("stagemousemove", function (evt) {
        // console.log("stagemousemove",evt.stageX,evt.stageY);
        mousePos = {x:evt.stageX,y:evt.stageY}
        if(bottomPipe){
            bottomPipe.x = mousePos.x - 80;
        }
    });
    // createLockup(["EaselJS"]);
}