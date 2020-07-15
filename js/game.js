const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");

// GLOBAL VARIABLES (or constants)
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const groundHeight = 70;
var speed = 4.7;
var acceleration = 0.1;

// RAPTOR
var raptor = {
    height : 80,
    width : 50,
    x : 150,
    y : 0,
    // calculate the y position  
    set_y : function () {this.y = (CANVAS_HEIGHT - this.height - groundHeight);},
    color: "#9e9e9e",

    draw : function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
raptor.set_y();

// CACTUS
var cactus = {
    width: 20,
    height : 50,
    x : CANVAS_WIDTH, 
    y : 0,

    set_y : function () {this.y = (CANVAS_HEIGHT - this.height - groundHeight);},
    color : "#a4a4a4",
    
    draw : function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
cactus.set_y();

// DRAW GROUND
function drawGround() {
    ctx.fillStyle = "#757575";
    ctx.fillRect(0,CANVAS_HEIGHT - groundHeight, CANVAS_WIDTH, groundHeight);
}


// VARIABLES NECCESARY FOR THE JUMPING MECHANICS

// has the jumping process begun
var jumping = false;
// how far in the air is the object
var jumpHeight = 0;
// is it ascending (ascend=true, descend or stationary=false)
var ascend = false
// physics
var maxFallVelocity = 10;
var fallVelocity = maxFallVelocity;
var lastFallVelocity = fallVelocity;
var gravity = 0.6;

// Spacebar listener
window.addEventListener("keydown", function jumpInit () { 
    if (this.event.keyCode == 32) {
        if (jumping && !ascend) {
            //if the jumping hasn't begun and ascend is set to false, just ignore the spacebar keypress
        } else {
            jumping = true;
            ascend = true;
        }
    }
});

function gameLoop() {

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    drawGround();
    raptor.draw();
    cactus.draw();

    cactus.x -= speed;
    
    if(cactus.x < 0) {
        cactus.x = CANVAS_WIDTH;
        speed += speed * acceleration;
    }

    // JUMPING MECHANICS
    if(jumping && ascend) {
        raptor.y -= fallVelocity;
        jumpHeight += fallVelocity;
        lastFallVelocity = fallVelocity;
        fallVelocity -= gravity;
    } 
    if (fallVelocity <= 0) {
        // now it starts descending 
        ascend = false;
        fallVelocity = lastFallVelocity;
    }
    if (jumping && !ascend) {
        raptor.y += fallVelocity;
        jumpHeight -= fallVelocity;
        fallVelocity += gravity;
    }
    if (jumping && jumpHeight <= 0) {
        // landing on the ground
        jumping = false;
        raptor.set_y();
        fallVelocity = maxFallVelocity;
    }
    
    // COLLISION DETECTION
    if( ( (raptor.x + raptor.width > cactus.x) && (raptor.x + raptor.width < cactus.x + cactus.width)) || ((raptor.x > cactus.x) && (raptor.x < cactus.x + cactus.width) ) ) {
        if (raptor.y + raptor.height >= cactus.y ) {
            return;
        }
    }

    requestAnimationFrame(gameLoop);
}

gameLoop();

