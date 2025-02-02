const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const scaledCanvas = {
    width: canvas.width / 4,
    height: canvas.height /4
}

const floorClsns2D = []
for(let i = 0; i< floorClsns.length; i +=36){
    floorClsns2D.push(floorClsns.slice(i, i + 36))
}

const clsnBlocks = []
floorClsns2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 192) {
           clsnBlocks.push(new ClsnBlock({position: {
            x: x * 16, 
            y: y * 16
        }}))
        }
    })
})

const platformClsns2D = []
for(let i = 0; i < platformClsns.length; i += 36){
    platformClsns2D.push(platformClsns.slice(i, i+36))
}

const platformClsnBlocks = []
platformClsns2D.forEach((row, y) => {
    row.forEach((symbol, x) => {
        if(symbol === 192) {
           platformClsnBlocks.push(new ClsnBlock({position: {
            x: x * 16, 
            y: y * 16
        },
        height: 4
    }))
        }
    })
})

const gravity = 0.1



const player = new Player({
    position: {
        x:100,
        y:300
    },
    clsnBlocks,
    platformClsnBlocks,
    imageSrc: 'img/warrior/Idle.png',
    frameRate: 8,
    animations: {
        Idle: {imageSrc: 'img/warrior/Idle.png',
                frameRate: 8,
               frameBuffer: 3},
        Run: {imageSrc: 'img/warrior/Run.png',
            frameRate: 8,
            frameBuffer: 5},
        Jump: {imageSrc: 'img/warrior/Jump.png',
            frameRate: 2,
            frameBuffer: 3},
        Fall: {imageSrc: 'img/warrior/Fall.png',
            frameRate: 2,
            rameBuffer: 3},
        IdleLeft: {imageSrc: 'img/warrior/IdleLeft.png',
            frameRate: 8,
            frameBuffer: 3},
        RunLeft: {imageSrc: 'img/warrior/RunLeft.png',
            frameRate: 8,
            frameBuffer: 5},
        FallLeft: {imageSrc: 'img/warrior/FallLeft.png',
            frameRate: 2,
            frameBuffer: 3},
        JumpLeft: {imageSrc: 'img/warrior/JumpLeft.png',
            frameRate: 2,
            frameBuffer: 3},                   
    },
})

const keys = {
    d:{
        pressed: false
    },
    a:{
        pressed: false
    },
    
}

const background = new Sprite({
    position: {x:0,
        y: 0
    },
    imageSrc: 'img/background.png'
})

const backgroundImageHeight = 432

const camera = {
    position:{
        x:0,
        y: -backgroundImageHeight + scaledCanvas.height,
    },
}

function animate(){
    window.requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    c.save()
    c.scale(4, 4)
    c.translate(camera.position.x, camera.position.y)
    background.update()
    

    player.checkForHorizontalCanvasclsn()
    player.update()  

    player.velocity.x = 0
    if(keys.d.pressed) {
        player.switchSprite('Run')
        player.velocity.x = 2
        player.lastDirection = 'right'
        player.shouldPanCamLeft({canvas, camera})

    }
    else if(keys.a.pressed) {
        player.switchSprite('RunLeft')
        player.velocity.x = -2
        player.lastDirection = 'left'
        player.shouldPanCamLeft({canvas, camera})
    }    
    else if ( player.velocity.y === 0){
        if(player.lastDirection === 'right')player.switchSprite('Idle')
        else player.switchSprite('IdleLeft')    
        
    }
    if(player.velocity.y < 0) {
        player.shouldPanCamDown({canvas, camera})
        if(player.lastDirection==='right') player.switchSprite('Jump')
        else player.switchSprite('JumpLeft') 
    }    
    else if(player.velocity.y > 0){
        player.shouldPanCamUp({camera, canvas})
        if(player.lastDirection === 'right') player.switchSprite('Fall')
        else if(player.lastDirection === 'left') player.switchSprite('FallLeft')    
        
     } 
    
    c.restore()
    
    

}

animate()
window.addEventListener('keydown', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = true
            
            break
        
        case 'a':
            keys.a.pressed = true
            
            break
            
        case ' ':
            
            player.velocity.y = -4
            break    
    }
       
    
})

window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false
            
            break
        
        case 'a':
            keys.a.pressed = false
            
            break
            
        
    }
       
    
})
