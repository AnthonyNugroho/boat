let r = false;
let l = false;
window.onkeydown = function(event)
  {
    if(event.keyCode == 39)
    {
      r = true;
    }
    if(event.keyCode == 37)
    {
      l = true;
    }
  }
window.onkeyup = function(event)
  {
    if(event.keyCode == 39)
    {
      r = false;
    }
    if(event.keyCode == 37)
    {
      l = false;
    }
  }


var canvas, engine, scene, camera;
document.addEventListener("DOMContentLoaded",function(){
//get renderCanvas
canvas = document.getElementById("renderCanvas");

//create babylon engine
engine = new BABYLON.Engine(canvas,true);

//create scene
scene = new BABYLON.Scene(engine);


var robotMain;

    robotMain = new BABYLON.Mesh.CreateBox("robotMain",1.0, scene);
    robotMain.isVisible = false;
    robotMain.position.y = 0;
    robotMain.isKilled = false;
    robotMain.Score = 0;

    BABYLON.SceneLoader.ImportMesh("","models/Vanquish/","ship1.babylon",scene, function(newMeshes)
    {
      for(i = 0; i < newMeshes.length; i++)
      {
        newMeshes[i].parent = robotMain;
      }

    });



var mat2 = new BABYLON.StandardMaterial("material2",scene);
  mat2.diffuseTexture = new BABYLON.Texture("fire.jpg",scene);

var box = function() {
  var minZ = camera.position.z+500;
  var maxZ = camera.position.z+1500;
  var minX = camera.position.x - 100, maxX = camera.position.x+100;
  var minSize = 2, maxSize = 10;

  var randomX, randomZ, randomSize;

  randomX = randomNumber(minX, maxX);
  randomZ = randomNumber(minZ, maxZ);
  randomSize = randomNumber(minSize, maxSize);

  var b = BABYLON.Mesh.CreateBox("bb", randomSize, scene);

  b.scaling.x = randomNumber(0.5, 1.5);
  b.scaling.y = randomNumber(4, 8);
  b.scaling.z = randomNumber(2, 3);

  b.position.x = randomX;
  b.position.y = b.scaling.y/2 ;
  b.position.z = randomZ;
  b.actionManager = new BABYLON.ActionManager(scene);



var trigger= {trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: robotMain};
var exec = new BABYLON.SwitchBooleanAction(trigger, robotMain, "isKilled");

b.actionManager.registerAction(exec);

b.material = mat2;
   };

   var explosion = function(){
     var explosion = new BABYLON.Sound("explosion", "Explosion+3.wav", scene, null, {loop: false, autoplay: true});
   }


camera = new BABYLON.FreeCamera("Camera", new BABYLON.Vector3(0, 3, -15), scene);
camera.speed = 4;

var mat = new BABYLON.StandardMaterial("material",scene);

mat.diffuseColor = new BABYLON.Color3(0,0,255);
mat.specularColor = new BABYLON.Color3(0,1,0);

mat.specularPower = 25;
mat.ambientColor = new BABYLON.Color3(0.23,0.90,0.53);
//transparency
mat.alpha = 1;


//create light
var light = new BABYLON.HemisphericLight("hlight", new BABYLON.Vector3(0,8,0),scene);

ground = new BABYLON.Mesh.CreateGround("ground",1000,1000,1,scene);
ground.material = mat;

var Bonus = function() {
    var Bonus = BABYLON.Mesh.CreateSphere("sphere", 20, 5, scene);
    Bonus.material = new BABYLON.StandardMaterial("material3", scene);
    Bonus.material.diffuseColor = BABYLON.Color3.Green();

    var minZ = camera.position.z+500;
    var maxZ = camera.position.z+1500;
    var minX = camera.position.x - 100, maxX = camera.position.x+100;

    Bonus.position.x = randomNumber(minX, maxX);
    Bonus.position.y = 2.5;
    Bonus.position.z = randomNumber(minZ, maxZ);

  Bonus.actionManager = new BABYLON.ActionManager(scene);

  var addscore = new BABYLON.IncrementValueAction(BABYLON.ActionManager.NothingTrigger, robotMain, "Score", 50);

  var trigger = {trigger:BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: robotMain};

  var combine = new BABYLON.CombineAction(trigger, [addscore]);

  Bonus.actionManager.registerAction(combine);
};

scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
scene.fogDensity = 0.005;


var randomNumber = function (min, max) {
   if (min == max) {
       return (min);
   }
   var random = Math.random();
   return ((random * (max - min)) + min);
}

setInterval(box, 100);
setInterval(Bonus, 500);



engine.runRenderLoop(function(){
  document.getElementById("scoreLabel").innerHTML = "Score: "+ robotMain.Score;
  if (! robotMain.isKilled){
  robotMain.position.z += 1.5;
  camera.position.z += 1.5;
  if(robotMain.Score >= 300)
  {
    robotMain.position.z += 2.5;
    camera.position.z += 2.5;
  }
  else if(robotMain.Score >= 600)
  {
    robotMain.position.z += 3.5;
    camera.position.z += 3.5;
  }
  else if(robotMain.Score >= 1000)
  {
    robotMain.position.z += 5;
    camera.position.z += 5;
  }

  if(r == true)
  {
    robotMain.position.x += 1;
    camera.position.x += 1;
  }
  if(l == true)
  {
    robotMain.position.x -= 1;
    camera.position.x -= 1;
  }

  ground.position = robotMain.position;
}	else {
      explosion();
      robotMain.position.z +=0;
      camera.position.z += 0;
      robotMain.dispose();
      alert("Your score: "+robotMain.Score);
      location.reload();
    }

  scene.render();
});
});
