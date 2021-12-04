

class attackState {
    constructor() {
  
    }
    execute(me) {
  
      if(dist(me.position.x, me.position.y, mySorsar.position.x, mySorsar.position.y) < 120)
        { //jump when within a certain distance of player
          me.jmp();
          if (mySorsar.position.y > me.position.y) 
          {
            me.changeState(0);
          }
        }
  
    }
  }  // attackState
  
  class chaseState {
    constructor() {
      this.step = new p5.Vector(0,0);
    }
    //chase when witin a certain range
    execute(me) {
      if(dist(me.position.x, me.position.y, mySorsar.position.x, mySorsar.position.y) < 120)
      {
          this.step.set(mySorsar.position.x - me.position.x, 0);
          this.step.normalize();
          me.position.add(this.step);
          if (( mySorsar.position.y < me.position.y) && (mySorsar.jump == 0) ) {
            me.changeState(1);
        }
      }
  
  
    }
  }  // chaseState
  
  
  
  class shoe { //enemy NPC
    constructor(x, y, o) {
  
      this.state = [new chaseState(), new attackState()];
      this.curState = 0;
      this.position = new p5.Vector(x, y);
      this.velocity = new p5.Vector(0, 0);
      this.acceleration = new p5.Vector(0, 0);
      this.force = new p5.Vector(0, 0);
      this.grav = true;
      this.norm_x = 0;
      this.norm_y = 0;
      this.Rnorm_x = 0;
      this.Rnorm_y = 0;
      this.roachFlag = false;
      this.wallFlag = false;
      this.currFrame = frameCount;
      this.jump = 0;
      this.obj = o;
    }
    changeState(x) {
      this.curState = x;
    }
    applyForce(force) {
      this.acceleration.add(force);
    }
    draw() 
    {
      image(shoeImg, this.position.x, this.position.y)
      this.acceleration.set(0, 0);
    }
    
  
    checkCollision()
    {
      
      if(abs(this.velocity.y) < 2)
      {
        this.jump = 0;
      }
      else
      {
        this.jump = 1;
      }
      if(dist(this.position.x, this.position.y, mySorsar.position.x, mySorsar.position.y) < 20)
      { //collision with player
        this.Rnorm_x = this.position.x - mySorsar.position.x;
        this.Rnorm_y = this.position.y  - mySorsar.position.y;
        this.roachFlag = true;
      }
      else
      {
        this.roachFlag = false;
      }
      if(this.roachFlag) //check if player is ontop of enemy
      {
        if(this.Rnorm_y > 0)
        {
          this.position.x = 2000;
        }
        else
        {
          if(game.gameState == 2)
          {
            game.gameState = 3;
          }
          else
          {
            game.gameState = 6;
          }
        }
  
      }
    this.acceleration.set(0, 0);
    if(this.position.y > 362)
    {
      this.grav = false;
      this.velocity.set(this.velocity.x, 0 )
    }
    else
    {
      this.grav = true;
    }
    for (var i=0; i<game.objects.length; i++) {//wall collision
      if (dist(this.position.x, this.position.y, game.objects[i].x, game.objects[i].y) < 30) 
      {       
          if (game.objects[i].collide) 
          {
              this.norm_x = this.position.x - game.objects[i].x;
              this.norm_y = this.position.y  - game.objects[i].y;
              this.wallFlag = true;
              break;
          }
        //other environment collision here
      }
  
  }
    if(this.wallFlag)
      {
        
       if(this.norm_y < -14)
          {
            this.grav = false;
            this.velocity.y = 0;
            this.position.y = game.objects[i].y - 26;
          }
          else if(norm_y > 10) //platform colision from bottom
              {
                this.jump = 1;
              }
         else if(this.norm_x > 14 )
          {              
           // this.force.add(0.1, 0)
            this.velocity.x = 0;
          }
        else if(this.norm_x < -14 )
          {
            //this.force.add(-0.1, 0)
            this.velocity.x = 0;
          }
      this.wallFlag = false;
      }
    else
      {
        this.force.set(0, 0);
        this.wallFlag = false;
  
      }
  
    }
    move()
    {
      this.applyForce(this.force);
      if(this.grav)
      {
        this.applyForce(gravity);
      }
      this.velocity.add(this.acceleration);
      this.position.add(this.velocity);
    
    }//end move
    jmp()
    {
      if(this.jump == 0)
      {
        this.jump = 1;
        this.force.add(0, -5);
      }
    }
  }//end shoe