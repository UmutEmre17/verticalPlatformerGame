class Player extends Sprite {
    constructor({position, clsnBlocks, platformClsnBlocks, imageSrc, frameRate, scale = 0.5, animations,}){
        super({imageSrc, frameRate, scale})
        this.position = position
        this.velocity = {
            x: 0,
            y: 1
        }
        
        this.clsnBlocks = clsnBlocks
        this.platformClsnBlocks = platformClsnBlocks
        this.hitbox = {
            position: {
                x: this.position.x,
                y:this.position.y
            },
            width: 10,
            height: 10,
        }

        this.animations = animations
        this.lastDirection = 'right'

        for(let key in this.animations){
            const image = new Image()
            image.src = this.animations[key].imageSrc

            this.animations[key].image = image
        }

        this.camerabox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            width:200,
            height: 80,
        }
    }

    switchSprite(key){
        if(this.image === this.animations[key].image || !this.loaded) return
        this.image = this.animations[key].image
        this.frameBuffer = this.animations[key].frameBuffer
        this.frameRate = this.animations[key].frameRate
    }

    updateCamerabox(){
        this.camerabox = {
            position: {
                x: this.position.x - 50 ,
                y: this.position.y,
            },
            width: 200,
            height: 80,
        }
    }
    checkForHorizontalCanvasclsn(){
        if (
            this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
            this.hitbox.position.x + this.velocity.x <= 0
          ) {
            this.velocity.x = 0
          }

    }

    shouldPanCamLeft({canvas, camera}){
        const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
        const scaledDownCanvasWidth = canvas.width / 4

        if (cameraboxRightSide >= 576) return

        if (
            cameraboxRightSide >=
            scaledDownCanvasWidth + Math.abs(camera.position.x)
           ) {
             camera.position.x -= this.velocity.x
            }

    }

    shouldPanCamRight({canvas, camera}){
        if (this.camerabox.position.x <= 0) return

        if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
            camera.position.x -= this.velocity.x
        }
    }

    shouldPanCamDown({canvas, camera}){
        if(this.camerabox.position.y + this.velocity.y <= 0) return
        if(this.camerabox.position.y <= Math.abs(camera.position.y)){
            camera.position.y -= this.velocity.y
        }
    }
    shouldPanCamUp({canvas, camera}){
        if (
            this.camerabox.position.y + this.camerabox.height + this.velocity.y >=
            432
          )
            return
      
          const scaledCanvasHeight = canvas.height / 4
      
          if (
            this.camerabox.position.y + this.camerabox.height >=
            Math.abs(camera.position.y) + scaledCanvasHeight
          ) {
            camera.position.y -= this.velocity.y
          }
    }
 
    update(){
        this.updateFrames()
        this.updateHitbox()
        this.updateCamerabox()

        
        
        this.draw()       
        this.position.x += this.velocity.x 
        this.updateHitbox()
        this.checkForHorizontalClsns()
        this.apllyGravity()
        this.updateHitbox()
        this.checkForVerticalClsns()     
    }
    updateHitbox(){
        this.hitbox = {
            position: {
                x: this.position.x + 35 ,
                y:this.position.y + 26
            },
            width: 14,
            height: 27
        }

    }

    checkForHorizontalClsns(){
        for(let i = 0; i<this.clsnBlocks.length; i++){
            const clsnBlock = this.clsnBlocks[i]

            if(clsn({object1: this.hitbox, object2: clsnBlock})){
                if(this.velocity.x > 0){
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

                    this.position.x = clsnBlock.position.x - offset - 0.01
                    break
                }
                if(this.velocity.x < 0){
                    this.velocity.x = 0

                    const offset = this.hitbox.position.x - this.position.x

                    this.position.x = clsnBlock.position.x + clsnBlock.width - offset + 0.01
                    break
                }

            }
        }
    }

    apllyGravity(){
        this.velocity.y += gravity
        this.position.y += this.velocity.y
        
    }
    checkForVerticalClsns(){
        for(let i = 0; i<this.clsnBlocks.length; i++){
            const clsnBlock = this.clsnBlocks[i]

            if(clsn({object1: this.hitbox, object2: clsnBlock})){
                if(this.velocity.y > 0){
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = clsnBlock.position.y - offset - 0.01
                    break
                }
                if(this.velocity.y < 0){
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y

                    this.position.y = clsnBlock.position.y + clsnBlock.height- offset + 0.01
                    break
                }

            }
        }

        for(let i = 0; i<this.platformClsnBlocks.length; i++){
            const platformClsnBlock = this.platformClsnBlocks[i]

            if(platformclsn({object1: this.hitbox, object2: platformClsnBlock})){
                if(this.velocity.y > 0){
                    this.velocity.y = 0

                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

                    this.position.y = platformClsnBlock.position.y - offset - 0.01
                    break
                }
                

            }
        }
    }
}
