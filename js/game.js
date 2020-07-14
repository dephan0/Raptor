const canvas = document.getElementById("gameScreen");
const ctx = canvas.getContext("2d");

// Setting global variables
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const groundHeight = 70;
var speed = 3.8;


var raptor = {
    height : 80,
    width : 50,
    x : 150,
    y : 0,
    // calculate the y position  
    set_y : function () {this.y = (CANVAS_HEIGHT - this.height - groundHeight);},
    color: "#757575",

    draw : function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
raptor.set_y();

var cactus = {
    width: 20,
    height : 50,
    color : "#388e3c",
    offset : CANVAS_WIDTH, 

    draw : function () {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.offset, CANVAS_HEIGHT - this.height - groundHeight, this.width, this.height);
    }
}

// FLAGS NECCESARY FOR THE JUMPING MECHANICS

// has the jumping process began
var jumping = false;
// how far in the air is the object
var jumpHeight = 0;
// is it ascending (ascend=true, descend or stationary=false)
var ascend = false
// physics
var fallVelocity = 5;
var maxJumpHeight = 100;
var gravity = 0.985;

window.addEventListener("keydown", function jumpInit () { 
    if (this.event.keyCode == 32) {
        if(jumping && !ascend) {

        } else {
            jumping = true;
            ascend = true;
        }
    }
});

function gameLoop() {

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    raptor.draw();
    cactus.draw();
    cactus.offset -= speed;
    if(cactus.offset < 0) {
        cactus.offset = CANVAS_WIDTH;
    }
    // jumping mechanics
    if(jumping && ascend) {
        raptor.y -= fallVelocity;
        jumpHeight += fallVelocity;
        fallVelocity *= gravity;
    } 
    if (jumpHeight >= maxJumpHeight) {
        // now it starts descending 
        ascend = false;
    }
    if (jumping && !ascend) {
        raptor.y += fallVelocity;
        jumpHeight -= fallVelocity;
        fallVelocity /= gravity;
    }
    if (jumping && jumpHeight <= 0) {
        jumping = false;
        raptor.set_y();
        fallVelocity = 5;
    }
    

    requestAnimationFrame(gameLoop);
}

gameLoop();