var startGameText = 'התחל משחק';
var reloadGameText = 'התחל משחק\nחדש';
var scoringGameMessage = 'הניקוד שלך: \n ';
var startGameMessage = 'עליך להגיע ליותר מ 500 נקודות בדקה!';
var soundFile = './assets/sounds/Switches78.mp3';
var audio = new Audio(soundFile);
let iTime = 58;
var img_1;
var img_2;

function renderView(){
    let start = document.getElementById('start');
    let end = document.getElementById('end');
    let width = window.innerWidth;
    // start.style.left = width/2 - start.offsetWidth/2;
    start.style.display = 'block';
    end.style.display = 'block';
    // console.log(start.offsetWidth)
    end.innerText =  startGameMessage;
    end.style.marginTop = window.innerHeight * 0.4;
    // end.style.left = start.style.left;
    // end.style.width = start.clientWidth;
    img_1 = document.getElementById("img_1");
    img_2 = document.getElementById("img_2");
}


function startGame(){

    let width_in_precent = window.innerWidth * 0.3;
    var tmpImage = 0;
    var topPipe;

    var checker = false;
    var bottomPipe;
    var mousePos;
    var newTime = iTime;
    var imageInitSize  = {};
    var double = 1.0005;

    var scoreCounter = 0;
    var score = document.getElementById("score");
    score.innerText = scoreCounter;

    var popUp = document.getElementById("popUp");
    popUp.style.display = "none";

    var canvas = document.getElementById("canvas"),
    stage = new createjs.StageGL(canvas, {antialias:true,transparent:true});
    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    // createjs.Ticker.interval = 25;
    createjs.Touch.enable(stage, false, true);
    var cont = stage.addChild(new createjs.Container())

    addBottomGate();
    addTopGateFromHTML();
    onTimer();

    // Load the banana
    var img = document.createElement("img");
    // img.crossOrigin = "Anonymous";
    img.src = "./assets/images/banana.png";
    img.onload = init;
    // var bmp = new createjs.Bitmap(img);
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
    var slide = 0.999;
    var doubleY = 1.001;
    var endGame = false;

    function tick(event) {
                if(endGame){
                    return;
                }
                if (counter % 15 === 0) {
                    addBanana();  
                }
                counter++;
                var limits = topPipe._getBounds();

                // console.log(limits)

                if(limits.x  + limits.width > window.innerWidth){
                    slide = - 1;
                }
                else if(topPipe._getBounds().x <= 0){
                    slide = 1;
                }

                var opsiTime = ((60 - newTime) / 60) ;
                var newOpsiTime = (slide === -1) ? opsiTime * -1 : opsiTime;
                
                var bounds = topPipe._getBounds();

                // console.log(topPipe.x,slide, newOpsiTime,opsiTime,newTime)
                topPipe.x = topPipe.x + (slide + newOpsiTime);



                var condition1 = bounds.y <= bounds.height * -0.1;
                var condition2 = bounds.height - bounds.y;
                // console.log(bounds);

                
                //POSITION
                if(condition1){
                    doubleY = 1.001;
                }else{
                    doubleY = 0.999;
                }
                // else if(bounds.y < 100){
                //     doubleY = 0.999;
                // }

                // topPipe.y *= doubleY;

                //SIZE
                if(topPipe.scaleX > 1.5){
                    double = 0.9995;
                }else if(topPipe.scaleX < 0.7){
                    double = 1.0005;
                }
                // topPipe.scaleX *= double; 
                // topPipe.scaleY *= double; 


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


                    
                    // var check1 = b.x < topPipe.x;
                    // var check2 = b.x > (topPipe.x - topPipe.image.width * 0.8);

                    //IF banana left X is in PIPE Range
                    var bounds = topPipe._getBounds();
                    var check1 = b.x > bounds.x + 10;
                    var check2 = b.x < bounds.x + bounds.width - 10;

                    if(check1 && check2){
                        var topLimit = b.y <= topPipe.y + topPipe.image.height - 40;
                        var startLimit = b.y <= topPipe.y + topPipe.image.height * 1.2;

                        if(topLimit){

                            // var img = document.getElementById("img");
                            // topPipe.image = img;

                            var topY = (topPipe.y < 0) ? 0 : topPipe.y;
                            // var topY = (topPipe.y < 0) ? 0 : topPipe.y;
                            if(topY+ topPipe.image.height > bottomPipe.y){
                                createjs.Tween.get(topPipe)
                                .to({y:topY + 10}, 100)
                                .to({y:topY - 5 - (60 - newTime) * 0.3 }, 100)   
                            }else{
                                createjs.Tween.get(topPipe)
                                .to({y:topY - 5 - (60 - newTime) * 0.3 }, 100)   
                            }

                            // .to({rotation:2, rotationDir:1})
                            // .wait(100)
                            // .to({rotation:0, rotationDir:1})
                            audio.play();
                            scoreCounter++;
                            score.innerText = scoreCounter;
                            bananas.splice(i,1);
                            b.parent.removeChild(b);

                        }else if(startLimit){//CHECK IF BANANAS GO SMALL FOR TOP GATE TO SWALLOW
                            if(b.scale > 0.3){
                                b.scale = b.scale * 0.96
                            }
                        }
                         
                    }else if (b.y <= 0) {
                        bananas.splice(i,1);
                        b.parent.removeChild(b)
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
        var max = 2;
        var min = 1;


        var speed = Math.random() * (max - min + 1) + min;
        var scale = Math.random() * (max - min + 1) + 2.5;

        var xPlace = (mousePos) ? mousePos.x :  canvas.width/2;
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

        // if(b.speed < 5){
        //     b.scale =1;
        // }else{
            b.scale = speed/3.5;
        // }
        // Speed is a factor of scale
    }

    function onTimer() {
        var i = newTime;
        if(i === undefined){
            i = 59;
        }

        let obj = document.getElementById('mycounter');
        if(i<= 20){
            obj.style.color = "red";
        }else if(i<= 40){
            obj.style.color = "#8e8e00"
        }
        if(i< 10){
            i = "0" + i;
            if(!obj.classList.contains("blink")){
                obj.classList.add("blink_me");
            }
        }
        obj.innerHTML = '0:' + i;
        newTime--;

        if (i <= 0) {
            obj.innerHTML = "0";
            obj.classList.remove("blink_me");
            endGame = true;
            let popUp = document.getElementById('popUp');
            let score = document.getElementById('score');
            popUp.style.display = 'block';
            end.innerText =  scoringGameMessage + score.innerText;
            start.innerText =  reloadGameText;
            end.style.display = 'block';
            // alert('You lose!');
        }
        else {
            setTimeout(onTimer, 1000);
        }
    }

    function addTopGateFromHTML(){

        var img1 = document.createElement("img");
        img1.src = "./assets/images/benel1.png";
        img1.onload = init;
        img1.width = img_1.width;
        img1.height = img_1.height;
        
        var img2 = document.createElement("img");
        img2.src = "./assets/images/benel2.png";
        img2.onload = init;
        img2.width = img_2.width;
        img2.height = img_2.height;
        topPipe = new createjs.Bitmap(img2);
        topPipe.set({
                x: window.innerWidth/2 + (img2.width/2),
                y:  0,
            });

        cont.addChild(topPipe);

        setInterval(() => {
            topPipe.image = (topPipe.image === img2) ? img1 : img2;
        }, 500);
    }

    function addTopGate(){
        var img = document.createElement("img");
        // img.crossOrigin = "Anonymous";
        img.src = "./assets/images/pipeline.svg";
        img.onload = init;

        width_in_precent = (width_in_precent < 250) ? width_in_precent : 250;
        img.width = width_in_precent;
        img.height = width_in_precent * 2;
        imageInitSize = {
            'width' : img.width,
            'height' : img.height,
        }

        tmpImage = img.width;

        var bmp = new createjs.Bitmap(img);

        cont.addChild(bmp);
        bmp.set({
            x: window.innerWidth/2 + (img.width/2),
            y:  bmp.image.height * 0.41,
            rotation:200,
        });
        topPipe =  bmp;         

    }

    function addBottomGate(){
        var img = document.createElement("img");
        // img.crossOrigin = "Anonymous";
        img.src = "./assets/images/pipeline.svg";
        img.onload = init;

        let width_in_precent = window.innerWidth * 0.3;
        width_in_precent = (width_in_precent < 250) ? width_in_precent : 250;
        img.width = width_in_precent
        img.height = width_in_precent * 2

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
}