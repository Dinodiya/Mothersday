var PLAY = 1;
var END = 0;
var gameState = PLAY;

var mom, mom_running, mom_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var choresGroup, chore1, chore2, chore3, chore4, chore5
var score=0;

var gameOver, restart;

localStorage["HighestScore"] = 0;

function preload(){
  mom_running =   loadAnimation("Running.png","Finish.png");
  mom_collided = loadAnimation("Collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  chore1 = loadImage("chore1.png");
  chore2 = loadImage("chore2.png");
  chore3 = loadImage("chore3.png");
  chore4 = loadImage("chore4.png");
  chore5 = loadImage("chore5.png");
  sunAnimation = loadImage("sun.png");

  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  canvas = createCanvas(displayWidth, displayHeight);
  
  mom = createSprite(50,180,20,50);
  
  mom.addAnimation("running", mom_running);
  mom.addAnimation("collided", mom_collided);
  mom.scale = 0.5;

  invisibleGround = createSprite(width/2,height-10,width,125);  
  invisibleGround.shapeColor = "#f4cbaa";
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.5

  

  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2
  ground.velocityX = -(6 + 3*score/100);

  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  

  gameOver.visible = false;
  restart.visible = false;

  cloudsGroup = new Group();
  choresGroup = new Group();

  score = 0;
}

function draw() {
  
  background("pink");
  textSize(30);
  text("Score: "+ score, 50,50);


  if (gameState===PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);

   if(keyDown("space") && mom.y >= 159) {
      mom.velocityY = -12;
    }

    mom.velocityY = mom.velocityY + 0.8

    if (ground.x < 0){
      ground.x = ground.width/2;
    }


    mom.collide(invisibleGround);
    spawnClouds();
    spawnChores();

    if(choresGroup.isTouching(mom)) {
    gameState = END;
  }
}
else if (gameState === END) {
  gameOver.visible = true;
  restart.visible = true;

  ground.velocityX = 0;
    mom.velocityY = 0;
    choresGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    mom.changeAnimation("collided",mom_collided);

    choresGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    if(mousePressedOver(restart)) {
      reset();
    }
  }

  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 90 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    //cloud.scale = 0.5;
    cloud.velocityX = -3;

    cloud.lifetime = 600;

    cloud.depth = mom.depth;
    mom.depth = mom.depth + 1;

    cloudsGroup.add(cloud);
  }
  
}

function spawnChores() {
  if(frameCount % 80 === 0) {
    var chore = createSprite(1400,height-95,20,30);
    
    chore.setCollider('circle',0,0,45)
    
    chore.velocityX = -(6 + 3*score/100);

    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: chore.addImage(chore1);
            break;
      case 2: chore.addImage(chore2);
              break;
      case 3: chore.addImage(chore3);
              break;
     case 4: chore.addImage(chore4);
              break;
     case 5: chore.addImage(chore5);
              break;
    default: break;

   }

   chore.scale = 0.5;
    chore.lifetime = 300;

   choresGroup.add(chore);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  choresGroup.destroyEach();
  cloudsGroup.destroyEach();

  mom.changeAnimation("running",mom_running);

  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  console.log(localStorage["HighestScore"]);
  
  score = 0;
  
}