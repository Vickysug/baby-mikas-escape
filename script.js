class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        this.load.image('background1', `https://play.rosebud.ai/assets/generate a brightly coloured cartoon background image of Beirut in 1983.png?vXY2`);
        this.load.image('boy', `https://play.rosebud.ai/assets/mika.purple.start.png?pBBH`);
        this.load.image('title', `https://play.rosebud.ai/assets/title.png?Vv4P`);
        this.load.image('spacebar', `https://play.rosebud.ai/assets/spacebar.png?4ZmE`);
        this.load.audio('HappySong', `https://play.rosebud.ai/assets/HappyDay_1.mp3.mp3?upL1`);
        this.load.audio('Spacebar', `https://play.rosebud.ai/assets/SFX Quainted.wav.wav?sQYM`)

    }

    create() {
        // Play the music
        this.music = this.sound.add('HappySong');
        this.music.play({
            loop: true // Loop the music
        });

        // Load and display the background
        this.add.image(400, 300, 'background1');

        // Load and display the boy at 200% scale, then reduce to 100% over 200ms
        this.boy = this.add.image(400, 300, 'boy').setScale(2);
        this.tweens.add({
            targets: this.boy,
            scale: 1,
            duration: 500,
            ease: 'Power2'
        });

        // Load and display the title, entering from the top of the screen over 200ms
        this.title = this.add.image(400, 300, 'title');
    

        // Load and display the spacebar, fading in and flashing
        this.spacebar = this.add.image(400, 300, 'spacebar')
            .setAlpha(0)
            .setInteractive();

        this.tweens.add({
            targets: this.spacebar,
            alpha: 1,
            yoyo: true,
            repeat: -1,
            duration: 500
        });

        // Listen for spacebar press to transition to the StoryScene
        this.input.keyboard.on('keydown-SPACE', () => {
            this.sound.play('Spacebar');
            this.music.stop('HappySong');
            this.scene.start('StoryScene');
        });
    }
}

class StoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoryScene' });
    }

    preload() {
        this.load.spritesheet('Story1Sprite', `https://play.rosebud.ai/assets/storybook1.1.png?eQdJ`, { frameWidth: 800, frameHeight: 600 });
        this.load.spritesheet('Story2Sprite', `https://play.rosebud.ai/assets/storybook..png?XGLz`, { frameWidth: 800, frameHeight: 600 });
        this.load.audio('SadSong', `https://play.rosebud.ai/assets/171220-jazz-style-piano-20557.mp3?vxX6`)

    }

    create() {
         // Play the music
        this.music = this.sound.add('SadSong');
        this.music.play({
            loop: true // Loop the music
        });

        this.storySprites = ['Story1Sprite', 'Story2Sprite'];
        
        let allFrames = this.anims.generateFrameNumbers(this.storySprites[0], { start: 0, end: 5 });

        // Concentrate all frames from all sprite sheets
        for (let i = 1; i < this.storySprites.length; i++) {
            allFrames = allFrames.concat(this.anims.generateFrameNumbers(this.storySprites[i], { start: 0, end: 5 }));
        }

        this.anims.create({
            key: 'Story',
            frames: allFrames,
            frameRate: 1/4,
            repeat: 0
        });

        let storySprite = this.add.sprite(400, 300, this.storySprites[0]).play('Story');



        storySprite.on('animationcomplete', () => { 
            this.fadeOutSound(this.music, 1000, () => {
                this.scene.start('Scene1');
            });
        }, this);
    }

    
    
    fadeOutSound(sound, duration, onComplete) {
        this.tweens.add({
            targets: sound,
            volume: 0,
            duration: duration,
            onComplete: () => {
                sound.stop(); // Stop the sound once it has faded out
                if (onComplete) onComplete(); // Call the onComplete callback if it exists
            }

            
        });
    }
}


class Scene1 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene1' });
        this.defaultFallSpeed = 1; // Default speed at which sprite falls
        this.fallSpeed = this.defaultFallSpeed;
        this.isZoomed = false; // Flag to check if camera is zoomed
        this.playerHitCount = 0; // Number of times player is hit
        this.isCameraShaking = false; // Flag to track camera shake
        this.bikesCollected = 0; // Number of bikes collected
        this.collectedBikes = []; // list to hold images of collected bikes
        this.spriteLivesMiniatures = [];
    }

    preload() {
        this.loadingText = this.add.text(400, 300, 'Collect as many bottles as possible!', { font: '30px Courier', fill: '#ffffff' }).setOrigin(0.5);
        this.loadingText2 = this.add.text(400, 330, 'Use arrow keys to move', { font: '30px Courier', fill: '#ffffff' }).setOrigin(0.5);
        this.load.image('background', `https://play.rosebud.ai/assets/background2.png?qFDP`);
        this.load.image('Overlap1Background', `https://play.rosebud.ai/assets/Background4.png.png?n7m3`);
        this.load.image('OverlapBackground', `https://play.rosebud.ai/assets/BackgroundOverlap2.png.png?w3tz`);
        this.load.spritesheet('spriteImage', `https://play.rosebud.ai/assets/baby-crying6.png?eFIe`, { frameWidth: 347, frameHeight: 347 });
        this.load.image('spriteImageMini', `https://play.rosebud.ai/assets/baby-crying-sprite.png?yBcF`);
        this.load.image('particleImage', `https://play.rosebud.ai/assets/frown.png.png?xGQR`);
        this.load.spritesheet('badGuy', `https://play.rosebud.ai/assets/group-colorful-rockets.png?2I2Y`, { frameWidth: 347, frameHeight: 347 });
        this.load.spritesheet('bike', `https://play.rosebud.ai/assets/bottles.png?Wc1T`, { frameWidth: 347, frameHeight: 347 });
        this.load.audio('music_1', `https://play.rosebud.ai/assets/19 Fleurkensland.mp3.mp3?6sf3`);
        this.load.spritesheet('cookie', `https://play.rosebud.ai/assets/GoreandBloodSprite.png.png?5FRG`, { frameWidth: 347, frameHeight: 347 });
        this.load.audio('laugh', `https://play.rosebud.ai/assets/Laugh.mp3.mp3?O1D3`);
        this.load.audio('splat', `https://play.rosebud.ai/assets/Splat.mp3.mp3?yJQr`);
        this.load.audio('ooh', `https://play.rosebud.ai/assets/Oooh.mp3.mp3?17iv`);

        // Add a load progress event listener
        this.load.on('progress', (value) => {
            console.log('Loading... ' + Math.round(value * 100) + '%');
        });
    }

    create() {
        this.playerHitCount = 0;
        this.loadingText.destroy();
        this.loadingText2.destroy();
        this.backgrounds = [];
        for (let i = 0; i < 2; i++) {
            const bg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'background').setOrigin(0, 0);
            this.backgrounds.push(bg);
        }

        // Create Overlap1Background 
        this.overlap1Backgrounds = [];
        for (let i = 0; i < 2; i++) {
            const overlap1Bg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'Overlap1Background').setOrigin(0, 0);
            this.overlap1Backgrounds.push(overlap1Bg);
        }
        
        // Create OverlapBackground 
        this.overlapBackgrounds = [];
        for (let i = 0; i < 2; i++) {
            const overlapBg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'OverlapBackground').setOrigin(0, 0);
            this.overlapBackgrounds.push(overlapBg);
        }

        this.anims.create({
            key: 'animateSprite',
            frames: this.anims.generateFrameNumbers('spriteImage', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Create four miniatures of sprite at the bottom right to represent lives
        for (let i = 0; i < 4; i++) {
            const xPosition = this.sys.game.config.width - 40 - i * 40;
            const miniatureSprite = this.add.image(xPosition, this.sys.game.config.height - 30, 'spriteImageMini');
            miniatureSprite.setScale(0.4);
            this.spriteLivesMiniatures.push(miniatureSprite);
        }

        // Create an animation for badGuy
        this.anims.create({
            key: 'animateBadGuy',
            frames: this.anims.generateFrameNumbers('badGuy', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        // Create an animation for Bike
        this.anims.create({
            key: 'animateBike',
            frames: this.anims.generateFrameNumbers('bike', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        // Create an animation for cookies
        this.anims.create({
            key: 'animateCookie',
            frames: this.anims.generateFrameNumbers('cookie', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.sprite = this.physics.add.sprite(400, this.sys.game.config.height / 2, 'spriteImage').play('animateSprite');
        this.sprite.setScale(0.5); // Scale the sprite to be 50% smaller
        this.sprite.setCircle(this.sprite.width / 4, this.sprite.width / 4, this.sprite.height / 4); // Set the collision circle to be centered around the sprite

        // Add and play background music
        this.music_1 = this.sound.add('music_1');
        this.music_1.play({ loop: true });

        this.cursors = this.input.keyboard.createCursorKeys();

        // Spawn bad guys every 3 seconds
        this.time.addEvent({
            delay: 3000,
            callback: () => {
                const badGuy = this.createBadGuy();
                this.sound.play('laugh'); // Play the laugh sound when the badGuy is spawned
                this.moveBadGuy(badGuy);
                this.physics.add.overlap(this.sprite, badGuy, (sprite, badGuy) => {
                    // Play the splat sound when the badGuy collides with the player
                    this.sound.play('splat');
                    // Create and scatter cookies when badGuy collides with sprite
                    this.createCookies(badGuy.x, badGuy.y);
                    badGuy.destroy();

                    // Increase the hit count and fade out background by 20%
                    this.playerHitCount++;
                    this.fadeOutBackground();

                 // Remove a miniature sprite from the scene
                if (this.spriteLivesMiniatures.length > 0) {
                const lastSpriteMiniature = this.spriteLivesMiniatures.pop();
                lastSpriteMiniature.destroy();
            }

                    if (this.playerHitCount === 4) {
                        this.scene.start('GameOver');
                        this.music_1.stop ('music_1')
                    }

                    if (!this.isZoomed) {
                        this.isZoomed = true;
                        this.cameras.main.zoomTo(2, 300, 'Power2');
                        this.time.delayedCall(500, () => {
                            this.cameras.main.zoomTo(1, 300, 'Power2');
                            this.isZoomed = false;
                        });
                    } else {
                        this.cameras.main.shake(250, 1);
                    }
                });
            },
            loop: true,
        });

        // Create the cookies group
        this.cookies = this.physics.add.group();

        // Add overlap detection for cookies
        this.physics.add.overlap(this.sprite, this.cookies, this.handleCookieCollision, null, this);

        // Spawn bikes every 6 seconds
        this.bikes = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 10,
            runChildUpdate: true
        });
        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.spawnBike();
            },
            loop: true
        });

        // Add overlap detection for bikes
        this.physics.add.overlap(this.sprite, this.bikes, this.handleBikeCollision, null, this);
    }
    
spawnBike() {
    const bike = this.physics.add.sprite(100, Phaser.Math.Between(0, this.sys.game.config.height), 'bike');
    bike.setCircle(86.75, 86.75, 86.75);
    bike.play('animateBike');
    this.bikes.add(bike);
    bike.setVelocityX(400);
}

    handleBikeCollision(sprite, bike) {
        bike.disableBody(true, true);
        this.sound.play('ooh');
        this.bikesCollected++;

        // Create and display tiny bike at top-right corner
        const xPosition = this.sys.game.config.width - 60- (this.bikesCollected - 1) * 90;
        const tinyBike = this.add.image(xPosition, 50, 'bike').setScale(0.3);
        this.collectedBikes.push(tinyBike);

        if (this.bikesCollected === 4) {
            this.scene.start('Scene2');
            this.music_1.stop('music_1');
        }
    }

    createBadGuy() {
        const badGuy = this.physics.add.sprite(Phaser.Math.Between(0, this.scale.width), 0, 'badGuy').play('animateBadGuy');
        badGuy.setCircle(badGuy.width / 4, badGuy.width / 4, badGuy.height / 4); // Set the collision circle to be centered around the badGuy
        badGuy.setFlip(Phaser.Math.Between(0, 1) === 1, false); // Randomly flip the badGuy horizontally
        badGuy.setAngle(Phaser.Math.Between(0, 80)); // Randomly rotate the badGuy
        return badGuy;
    }

    moveBadGuy(badGuy) {
        this.tweens.add({
            targets: badGuy,
            x: { value: Phaser.Math.Between(0, this.scale.width), duration: 3500 },
            y: { value: this.scale.height + badGuy.height, duration: 3500 },
            onComplete: () => { badGuy.destroy(); }
        });
    }

    createCookies(x, y) {
        // Create 4 cookies
        for (let i = 0; i < 4; i++) {
            const cookie = this.cookies.create(x, y, 'cookie').play('animateCookie');
            cookie.setScale(0.25); // Scale the cookie to be 25% of its original size
            cookie.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        }
    }

    handleCookieCollision(sprite, cookie) {
        // Destroy the cookie
        cookie.destroy();

        // Shake the camera for 3 seconds
        this.isCameraShaking = true;
        this.cameras.main.shake(200);
        this.time.delayedCall(200, () => {
            this.isCameraShaking = false;
        });
    }

    fadeOutBackground() {
        // Calculate the alpha reduction based on the hit count and initial alpha
        const alphaReduction = 0.2 * this.playerHitCount;
        const newAlpha = Math.max(0, 1 - alphaReduction);

        // Set new alpha for each background
        this.backgrounds.forEach(bg => {
            bg.setAlpha(newAlpha);
});
    }

    update(time, delta) {
        // Move the sprite left or right based on arrow key input
        if (this.cursors.left.isDown && this.sprite.x > 0) {
            this.sprite.x -= 5;
            this.sprite.angle -= 4; // rotate to the left
        } else if (this.cursors.right.isDown && this.sprite.x < this.sys.game.config.width) {
            this.sprite.x += 5;
            this.sprite.angle += 4; // rotate to the right
        }

        // Move the sprite up or down based on arrow key input, and adjust fall speed
        if (this.cursors.up.isDown && this.sprite.y > 0) {
            this.sprite.y -= 5;
            this.fallSpeed = Math.max(5, this.fallSpeed - 0.1); // minimum fall speed is 5
        } else if (this.cursors.down.isDown && this.sprite.y < this.sys.game.config.height) {
            this.sprite.y += 3;
            this.fallSpeed = Math.min(15, this.fallSpeed + 0.1); // maximum fall speed is 15
        } else {
            // Reset fall speed to default when up key is released
            this.fallSpeed = this.defaultFallSpeed;
        }

        // Move the backgrounds up to simulate falling
        this.backgrounds.forEach(bg => {
            bg.y -= this.fallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });

                // Make the overlap1Backgrounds move faster by increasing the fall speed
        const overlap1FallSpeed = this.fallSpeed * 1.3; // Increase the fall speed for overlap1Backgrounds
        this.overlap1Backgrounds.forEach(bg => {
            bg.y -= overlap1FallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });

        // Make the overlapBackgrounds move faster by increasing the fall speed
        const overlapFallSpeed = this.fallSpeed * 2; // Increase the fall speed for overlapBackgrounds
        this.overlapBackgrounds.forEach(bg => {
            bg.y -= overlapFallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });
    }
}
    


class Scene2 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene2' });
        this.defaultFallSpeed = 15; // Default speed at which sprite falls
        this.fallSpeed = this.defaultFallSpeed;
        this.isZoomed = false; // Flag to check if camera is zoomed
        this.playerHitCount = 0; // Number of times player is hit
        this.isCameraShaking = false; // Flag to track camera shake
        this.greenbikesCollected = 0; // Number of greenbikes collected
        this.collectedGreenbikes = []; // list to hold images of collected greenbikes
        this.spriteLivesMiniatures = [];

    }

    preload() {
        this.loadingText = this.add.text(400, 300, 'Collect more bottles.', { font: '20px Courier', fill: '#ffffff' }).setOrigin(0.5);
        this.load.image('background3', `https://play.rosebud.ai/assets/background2a.png?3HE0`);
        this.load.image('Overlap1Background', `https://play.rosebud.ai/assets/Background4.png.png?n7m3`);
        this.load.image('OverlapBackground', `https://play.rosebud.ai/assets/BackgroundOverlap2.png.png?w3tz`);
        this.load.spritesheet('spriteImage', `https://play.rosebud.ai/assets/LittleGuy.png.png?qkhI`, { frameWidth: 347, frameHeight: 347 });
        this.load.image('particleImage', `https://play.rosebud.ai/assets/frown.png.png?xGQR`);
        this.load.spritesheet('badGirl', `https://play.rosebud.ai/assets/BadGirl.png.png?KID3`, { frameWidth: 347, frameHeight: 347 }); // Renamed 'badGuy' to 'badGirl'
        this.load.spritesheet('greenbike', `https://play.rosebud.ai/assets/bottles.png?Wc1T`, { frameWidth: 347, frameHeight: 347 }); // Renamed 'bike' to 'greenbike'
        this.load.audio('happySong', `https://play.rosebud.ai/assets/HappyDay_1.mp3.mp3?upL1`);
        this.load.spritesheet('cookie', `https://play.rosebud.ai/assets/GoreandBloodSprite.png.png?5FRG`, { frameWidth: 347, frameHeight: 347 });
        this.load.audio('bwa', `https://play.rosebud.ai/assets/BadGirl2.mp3.mp3?sePW`);
        this.load.audio('splat', `https://play.rosebud.ai/assets/Splat.mp3.mp3?yJQr`);
        this.load.audio('ooh', `https://play.rosebud.ai/assets/Oooh.mp3.mp3?17iv`);

        // Add a load progress event listener
        this.load.on('progress', (value) => {
            console.log('Loading... ' + Math.round(value * 100) + '%');
        });
    }

    create() {
        this.playerHitCount = 0;
        this.loadingText.destroy();
        this.backgrounds = [];
        for (let i = 0; i < 2; i++) {
            const bg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'background3').setOrigin(0, 0);
            this.backgrounds.push(bg);
        }

        // Create Overlap1Background 
        this.overlap1Backgrounds = [];
        for (let i = 0; i < 2; i++) {
            const overlap1Bg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'Overlap1Background').setOrigin(0, 0);
            this.overlap1Backgrounds.push(overlap1Bg);
        }
        
        // Create OverlapBackground 
        this.overlapBackgrounds = [];
        for (let i = 0; i < 2; i++) {
            const overlapBg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'OverlapBackground').setOrigin(0, 0);
            this.overlapBackgrounds.push(overlapBg);
        }

        this.anims.create({
            key: 'animateSprite',
            frames: this.anims.generateFrameNumbers('spriteImage', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Create four miniatures of sprite at the bottom right to represent lives
        for (let i = 0; i < 4; i++) {
            const xPosition = this.sys.game.config.width - 40 - i * 40;
            const miniatureSprite = this.add.image(xPosition, this.sys.game.config.height - 30, 'spriteImageMini');
            miniatureSprite.setScale(0.4);
            this.spriteLivesMiniatures.push(miniatureSprite);
        }

        // Create an animation for badGirl
        this.anims.create({
            key: 'animateBadGirl', // Renamed 'animateBadGuy' to 'animateBadGirl'
            frames: this.anims.generateFrameNumbers('badGirl', { start: 0, end: 5 }), // Renamed 'badGuy' to 'badGirl'
            frameRate: 8,
            repeat: -1
        });

        // Create an animation for Greenbike
        this.anims.create({
            key: 'animateGreenbike', // Renamed 'animateBike' to 'animateGreenbike'
            frames: this.anims.generateFrameNumbers('greenbike', { start: 0, end: 5 }), // Renamed 'bike' to 'greenbike'
            frameRate: 8,
            repeat: -1
        });

        // Create an animation for cookies
        this.anims.create({
            key: 'animateCookie',
            frames: this.anims.generateFrameNumbers('cookie', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.sprite = this.physics.add.sprite(400, this.sys.game.config.height / 2, 'spriteImage').play('animateSprite');
        this.sprite.setScale(0.5); // Scale the sprite to be 50% smaller
        this.sprite.setCircle(this.sprite.width / 4, this.sprite.width / 4, this.sprite.height / 4); // Set the collision circle to be centered around the sprite

        // Add and play background music
        this.happySong = this.sound.add('happySong');
        this.happySong.play({ loop: true, volume: 0.5 }); // Lower volume by 50%

        this.cursors = this.input.keyboard.createCursorKeys();

        // Spawn bad girls every 2 seconds
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const badGirl = this.createBadGirl(); // Renamed 'badGuy' to 'badGirl'
                this.sound.play('bwa'); // Play the laugh sound when the badGirl is spawned
                this.moveBadGirl(badGirl); // Renamed 'moveBadGuy' to 'moveBadGirl'
                this.physics.add.overlap(this.sprite, badGirl, (sprite, badGirl) => { // Renamed 'badGuy' to 'badGirl'
                    // Play the splat sound when the badGirl collides with the player
                    this.sound.play('splat');
                    // Create and scatter cookies when badGirl collides with sprite
                    this.createCookies(badGirl.x, badGirl.y); // Renamed 'badGuy' to 'badGirl'
                    badGirl.destroy(); // Renamed 'badGuy' to 'badGirl'

                    // Increase the hit count and fade out background by 20%
                    this.playerHitCount++;
                    this.fadeOutBackground();

            // Remove a miniature sprite from the scene
            if (this.spriteLivesMiniatures.length > 0) {
                const lastSpriteMiniature = this.spriteLivesMiniatures.pop();
                lastSpriteMiniature.destroy();
            }

                    if (this.playerHitCount === 4) {
                        this.scene.start('GameOver');
                        this.happySong.stop('happySong');
                    }

                    if (!this.isZoomed) {
                        this.isZoomed = true;
                        this.cameras.main.zoomTo(2, 300, 'Power2');
                        this.time.delayedCall(500, () => {
                            this.cameras.main.zoomTo(1, 300, 'Power2');
                            this.isZoomed = false;
                        });
                    } else {
                        this.cameras.main.shake(250, 1);
                    }
                });
            },
            loop: true,
        });

        // Create the cookies group
        this.cookies = this.physics.add.group();

        // Add overlap detection for cookies
        this.physics.add.overlap(this.sprite, this.cookies, this.handleCookieCollision, null, this);

        // Spawn greenbikes every 15 seconds
        this.greenbikes = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 10,
            runChildUpdate: true
        });
        this.time.addEvent({
            delay: 8000,
            callback: () => {
                this.spawnGreenbike();
            },
            loop: true
        });

        // Add overlap detection for greenbikes
        this.physics.add.overlap(this.sprite, this.greenbikes, this.handleGreenbikeCollision, null, this);

      // Set depth of OverlapBackground to be in front of sprite and badguys
        this.overlapBackgrounds.forEach(overlapBg => {
            overlapBg.setDepth(1);
        });
    }


    spawnGreenbike() {
        const greenbike = this.physics.add.sprite(100, Phaser.Math.Between(0, this.sys.game.config.height), 'greenbike');
        greenbike.setCircle(86.75, 86.75, 86.75);
        greenbike.play('animateGreenbike');
        this.greenbikes.add(greenbike);
        greenbike.setVelocityX(400);
    }

    handleGreenbikeCollision(sprite, greenbike) {
        greenbike.disableBody(true, true);
        this.sound.play('ooh');
        this.greenbikesCollected++;

        // Create and display tiny greenbike at top-right corner
        const xPosition = this.sys.game.config.width - 60- (this.greenbikesCollected - 1) * 90;
        const tinyGreenbike = this.add.image(xPosition, 50, 'greenbike').setScale(0.3); 
        this.collectedGreenbikes.push(tinyGreenbike);

        if (this.greenbikesCollected === 4) {
            this.scene.start('Scene3');
            this.happySong.stop();
        }
    }

    createBadGirl() {
        const badGirl = this.physics.add.sprite(Phaser.Math.Between(0, this.scale.width), 0, 'badGirl').play('animateBadGirl');
        badGirl.setScale(0.8);
        badGirl.setCircle(badGirl.width / 4, badGirl.width / 4, badGirl.height / 4);
        badGirl.setFlip(Phaser.Math.Between(0, 1) === 1, false);
        badGirl.setAngle(Phaser.Math.Between(0, 80));
        return badGirl;
    }

    moveBadGirl(badGirl) {
        this.tweens.add({
            targets: badGirl,
            x: { value: Phaser.Math.Between(0, this.scale.width), duration: 3500 },
            y: { value: this.scale.height + badGirl.height, duration: 3500 },
            onComplete: () => { badGirl.destroy(); }
        });
    }

    createCookies(x, y) {
        for (let i = 0; i < 4; i++) {
            const cookie = this.cookies.create(x, y, 'cookie').play('animateCookie');
            cookie.setScale(0.25);
            cookie.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        }
    }

    handleCookieCollision(sprite, cookie) {
        cookie.destroy();
        this.isCameraShaking = true;
        this.cameras.main.shake(200);
        this.time.delayedCall(200, () => {
            this.isCameraShaking = false;
        });
    }

    fadeOutBackground() {
        const alphaReduction = 0.2 * this.playerHitCount;
        const newAlpha = Math.max(0, 1 - alphaReduction);
        this.backgrounds.forEach(bg => {
            bg.setAlpha(newAlpha);
        });
    }

    update(time, delta) {
        if (this.cursors.left.isDown && this.sprite.x > 0) {
            this.sprite.x -= 5;
            this.sprite.angle -= 4;
        } else if (this.cursors.right.isDown && this.sprite.x < this.sys.game.config.width) {
            this.sprite.x += 5;
            this.sprite.angle += 4;
        }

        if (this.cursors.up.isDown && this.sprite.y > 0) {
            this.sprite.y -= 5;
            this.fallSpeed = Math.max(5, this.fallSpeed - 0.1);
        } else if (this.cursors.down.isDown && this.sprite.y < this.sys.game.config.height) {
            this.sprite.y += 3;
            this.fallSpeed = Math.min(15, this.fallSpeed + 0.1);
        } else {
            this.fallSpeed = this.defaultFallSpeed;
        }

        this.backgrounds.forEach(bg => {
            bg.y -= this.fallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
            
        });

                // Make the overlap1Backgrounds move faster by increasing the fall speed
        const overlap1FallSpeed = this.fallSpeed * 1.3; // Increase the fall speed for overlap1Backgrounds
        this.overlap1Backgrounds.forEach(bg => {
            bg.y -= overlap1FallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });

        // Make the overlapBackgrounds move faster by increasing the fall speed
        const overlapFallSpeed = this.fallSpeed * 2; // Increase the fall speed for overlapBackgrounds
        this.overlapBackgrounds.forEach(bg => {
            bg.y -= overlapFallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });
    }
}

class Scene3 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene3' });
        this.defaultFallSpeed = 15; // Default speed at which sprite falls
        this.fallSpeed = this.defaultFallSpeed;
        this.isZoomed = false; // Flag to check if camera is zoomed
        this.playerHitCount = 0; // Number of times player is hit
        this.isCameraShaking = false; // Flag to track camera shake
        this.bluebikesCollected = 0; // Number of bluebikes collected
        this.collectedBluebikes = []; // list to hold images of collected bluebikes
        this.spriteLivesMiniatures = [];

    }

    preload() {
        this.loadingText = this.add.text(400, 300, 'The path continues, four more bikes please', { font: '20px Courier', fill: '#ffffff' }).setOrigin(0.5);
        this.load.image('scaryBackground', `https://play.rosebud.ai/assets/background2a.png?3HE0`);
        this.load.image('Overlap1Background', `https://play.rosebud.ai/assets/Background4.png.png?n7m3`);
        this.load.image('OverlapBackground', `https://play.rosebud.ai/assets/BackgroundOverlap2.png.png?w3tz`);
        this.load.spritesheet('spriteImage', `https://play.rosebud.ai/assets/LittleGuy.png.png?qkhI`, { frameWidth: 347, frameHeight: 347 });
        this.load.image('particleImage', `https://play.rosebud.ai/assets/frown.png.png?xGQR`);
        this.load.spritesheet('badblob', `https://play.rosebud.ai/assets/BadBlob.png.png?Jtyx`, { frameWidth: 347, frameHeight: 347 });
        this.load.spritesheet('bluebike', `https://play.rosebud.ai/assets/BlueBikeSpriteSheet.png.png?sFdu`, { frameWidth: 347, frameHeight: 347 }); 
        this.load.audio('scarySong', `https://play.rosebud.ai/assets/ScarySong.mp3.mp3?8WWg`);
        this.load.spritesheet('cookie', `https://play.rosebud.ai/assets/GoreandBloodSprite.png.png?5FRG`, { frameWidth: 347, frameHeight: 347 });
        this.load.audio('laugh', `https://play.rosebud.ai/assets/Laugh.mp3.mp3?O1D3`);
        this.load.audio('splat', `https://play.rosebud.ai/assets/Splat.mp3.mp3?yJQr`);
        this.load.audio('ooh', `https://play.rosebud.ai/assets/Oooh.mp3.mp3?17iv`);

        // Add a load progress event listener
        this.load.on('progress', (value) => {
            console.log('Loading... ' + Math.round(value * 100) + '%');
        });
    }

    create() {
        this.playerHitCount = 0;
        this.loadingText.destroy();
        this.backgrounds = [];
        for (let i = 0; i < 2; i++) {
            const bg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'scaryBackground').setOrigin(0, 0);
            this.backgrounds.push(bg);
        }

         // Create Overlap1Background in the same manner as fakBackground
        this.overlap1Backgrounds = [];
        for (let i = 0; i < 2; i++) {
            const overlap1Bg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'Overlap1Background').setOrigin(0, 0);
            this.overlap1Backgrounds.push(overlap1Bg);
        }
        
        // Create OverlapBackground in the same manner as fakBackground
        this.overlapBackgrounds = [];
        for (let i = 0; i < 2; i++) {
            const overlapBg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'OverlapBackground').setOrigin(0, 0);
            this.overlapBackgrounds.push(overlapBg);
        }

        this.anims.create({
            key: 'animateSprite',
            frames: this.anims.generateFrameNumbers('spriteImage', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Create four miniatures of sprite at the bottom right to represent lives
        for (let i = 0; i < 4; i++) {
            const xPosition = this.sys.game.config.width - 40 - i * 40;
            const miniatureSprite = this.add.image(xPosition, this.sys.game.config.height - 30, 'spriteImageMini');
            miniatureSprite.setScale(0.4);
            this.spriteLivesMiniatures.push(miniatureSprite);
        }

        // Create an animation for badblob
        this.anims.create({
            key: 'animatebadblob', // Renamed 'animateBadGuy' to 'animatebadblob'
            frames: this.anims.generateFrameNumbers('badblob', { start: 0, end: 5 }), 
            frameRate: 8,
            repeat: -1
        });

        // Create an animation for Bluebike
        this.anims.create({
            key: 'animateBluebike', 
            frames: this.anims.generateFrameNumbers('bluebike', { start: 0, end: 5 }), 
            frameRate: 8,
            repeat: -1
        });

        // Create an animation for cookies
        this.anims.create({
            key: 'animateCookie',
            frames: this.anims.generateFrameNumbers('cookie', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.sprite = this.physics.add.sprite(400, this.sys.game.config.height / 2, 'spriteImage').play('animateSprite');
        this.sprite.setScale(0.5); // Scale the sprite to be 50% smaller
        this.sprite.setCircle(this.sprite.width / 4, this.sprite.width / 4, this.sprite.height / 4); // Set the collision circle to be centered around the sprite

        // Add and play background music
      this.scarySong = this.sound.add('scarySong');
        this.scarySong.play({ loop: true, volume: 0.9 }); // Lower volume by 50%

        this.cursors = this.input.keyboard.createCursorKeys();

        // Spawn bad girls every 2 seconds
        this.time.addEvent({
            delay: 1500,
            callback: () => {
                const badblob = this.createbadblob(); // Renamed 'badGuy' to 'badblob'
                this.sound.play('laugh'); // Play the laugh sound when the badblob is spawned
                this.movebadblob(badblob); // Renamed 'moveBadGuy' to 'movebadblob'
                this.physics.add.overlap(this.sprite, badblob, (sprite, badblob) => { // Renamed 'badGuy' to 'badblob'
                    // Play the splat sound when the badblob collides with the player
                    this.sound.play('splat');
                    // Create and scatter cookies when badblob collides with sprite
                    this.createCookies(badblob.x, badblob.y); // Renamed 'badGuy' to 'badblob'
                    badblob.destroy(); // Renamed 'badGuy' to 'badblob'

                    // Increase the hit count and fade out background by 20%
                    this.playerHitCount++;
                    this.fadeOutBackground();

             // Remove a miniature sprite from the scene
            if (this.spriteLivesMiniatures.length > 0) {
                const lastSpriteMiniature = this.spriteLivesMiniatures.pop();
                lastSpriteMiniature.destroy();
            }

                    if (this.playerHitCount === 4) {
                        this.scene.start('GameOver');
                        this.scarySong.stop('scarySong');
                    }

                    if (!this.isZoomed) {
                        this.isZoomed = true;
                        this.cameras.main.zoomTo(2, 300, 'Power2');
                        this.time.delayedCall(500, () => {
                            this.cameras.main.zoomTo(1, 300, 'Power2');
                            this.isZoomed = false;
                        });
                    } else {
                        this.cameras.main.shake(250, 1);
                    }
                });
            },
            loop: true,
        });

        // Create the cookies group
        this.cookies = this.physics.add.group();

        // Add overlap detection for cookies
        this.physics.add.overlap(this.sprite, this.cookies, this.handleCookieCollision, null, this);

        // Spawn bluebikes every 15 seconds
        this.bluebikes = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 10,
            runChildUpdate: true
        });
        this.time.addEvent({
            delay: 10000,
            callback: () => {
                this.spawnBluebike();
            },
            loop: true
        });

        // Add overlap detection for bluebikes
        this.physics.add.overlap(this.sprite, this.bluebikes, this.handleBluebikeCollision, null, this);
    
        // Set depth of OverlapBackground to be in front of sprite and badguys
        this.overlapBackgrounds.forEach(overlapBg => {
            overlapBg.setDepth(1);
        });
    }

    spawnBluebike() {
        const bluebike = this.physics.add.sprite(100, Phaser.Math.Between(0, this.sys.game.config.height), 'bluebike');
        bluebike.setCircle(86.75, 86.75, 86.75);
        bluebike.play('animateBluebike');
        this.bluebikes.add(bluebike);
        bluebike.setVelocityX(600);
    }

    handleBluebikeCollision(sprite, bluebike) {
        bluebike.disableBody(true, true);
        this.sound.play('ooh');
        this.bluebikesCollected++;

        // Create and display tiny bluebike at top-right corner
        const xPosition = this.sys.game.config.width - 60- (this.bluebikesCollected - 1) * 90;
        const tinyBluebike = this.add.image(xPosition, 50, 'bluebike').setScale(0.3); // Scale down the tiny blue bike
        this.collectedBluebikes.push(tinyBluebike);

        if (this.bluebikesCollected === 4) {
            this.scene.start('Scene4');
            this.scarySong.stop();
        }
    }

    createbadblob() {
        const badblob = this.physics.add.sprite(Phaser.Math.Between(0, this.scale.width), 0, 'badblob').play('animatebadblob');
        badblob.setCircle(badblob.width / 4, badblob.width / 4, badblob.height / 4);
        badblob.setFlip(Phaser.Math.Between(0, 1) === 1, false);
        badblob.setAngle(Phaser.Math.Between(0, 80));
        return badblob;
    }

    movebadblob(badblob) {
        this.tweens.add({
            targets: badblob,
            x: { value: Phaser.Math.Between(0, this.scale.width), duration: 3500 },
            y: { value: this.scale.height + badblob.height, duration: 3500 },
            onComplete: () => { badblob.destroy(); }
        });
    }

    createCookies(x, y) {
        for (let i = 0; i < 4; i++) {
            const cookie = this.cookies.create(x, y, 'cookie').play('animateCookie');
            cookie.setScale(0.25);
            cookie.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        }
    }

    handleCookieCollision(sprite, cookie) {
        cookie.destroy();
        this.isCameraShaking = true;
        this.cameras.main.shake(200);
        this.time.delayedCall(200, () => {
            this.isCameraShaking = false;
        });
    }

    fadeOutBackground() {
        const alphaReduction = 0.2 * this.playerHitCount;
        const newAlpha = Math.max(0, 1 - alphaReduction);
        this.backgrounds.forEach(bg => {
            bg.setAlpha(newAlpha);
        });
    }

    update(time, delta) {
        if (this.cursors.left.isDown && this.sprite.x > 0) {
            this.sprite.x -= 5;
            this.sprite.angle -= 4;
        } else if (this.cursors.right.isDown && this.sprite.x < this.sys.game.config.width) {
            this.sprite.x += 5;
            this.sprite.angle += 4;
        }

        if (this.cursors.up.isDown && this.sprite.y > 0) {
            this.sprite.y -= 5;
            this.fallSpeed = Math.max(5, this.fallSpeed - 0.1);
        } else if (this.cursors.down.isDown && this.sprite.y < this.sys.game.config.height) {
            this.sprite.y += 3;
            this.fallSpeed = Math.min(15, this.fallSpeed + 0.1);
        } else {
            this.fallSpeed = this.defaultFallSpeed;
        }

        this.backgrounds.forEach(bg => {
            bg.y -= this.fallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });

                // Make the overlap1Backgrounds move faster by increasing the fall speed
        const overlap1FallSpeed = this.fallSpeed * 1.3; // Increase the fall speed for overlap1Backgrounds
        this.overlap1Backgrounds.forEach(bg => {
            bg.y -= overlap1FallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });

        // Make the overlapBackgrounds move faster by increasing the fall speed
        const overlapFallSpeed = this.fallSpeed * 2; // Increase the fall speed for overlapBackgrounds
        this.overlapBackgrounds.forEach(bg => {
            bg.y -= overlapFallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });
    }
}

class Scene4 extends Phaser.Scene {
    constructor() {
        super({ key: 'Scene4' });
        this.defaultFallSpeed = 1; // Default speed at which sprite falls
        this.fallSpeed = this.defaultFallSpeed;
        this.isZoomed = false; // Flag to check if camera is zoomed
        this.playerHitCount = 0; // Number of times player is hit
        this.isCameraShaking = false; // Flag to track camera shake
        this.bluebikesCollected = 0; // Number of bluebikes collected
        this.collectedBluebikes = []; // list to hold images of collected bluebikes
        this.spriteLivesMiniatures = [];
        
    }

    preload() {
        this.loadingText = this.add.text(400, 300, 'Escape. Four. Bikes.', { font: '20px Courier', fill: '#ffffff' }).setOrigin(0.5);
        this.load.image('fakBackground', `https://play.rosebud.ai/assets/FakBackground.png.png?DnMt`);
        this.load.image('Overlap1Background', `https://play.rosebud.ai/assets/Background4.png.png?n7m3`);
        this.load.image('OverlapBackground', `https://play.rosebud.ai/assets/BackgroundOverlap2.png.png?w3tz`);
        this.load.spritesheet('spriteImage', `https://play.rosebud.ai/assets/LittleGuy.png.png?qkhI`, { frameWidth: 347, frameHeight: 347 });
        this.load.image('spriteImageMini', `https://play.rosebud.ai/assets/baby-crying-sprite.png?yBcF`);
        this.load.image('particleImage', `https://play.rosebud.ai/assets/frown.png.png?xGQR`);
        this.load.spritesheet('fakdude', `https://play.rosebud.ai/assets/FuckDude.png.png?pb3o`, { frameWidth: 347, frameHeight: 347 });
        this.load.spritesheet('bluebike', `https://play.rosebud.ai/assets/BlueBikeSpriteSheet.png.png?sFdu`, { frameWidth: 347, frameHeight: 347 }); 
        this.load.audio('fakSong', `https://play.rosebud.ai/assets/FakMusic.mp3.mp3?OnVx`);
        this.load.spritesheet('cookie', `https://play.rosebud.ai/assets/GoreandBloodSprite.png.png?5FRG`, { frameWidth: 347, frameHeight: 347 });
        this.load.audio('newoo', `https://play.rosebud.ai/assets/BadGirl2.mp3.mp3?sePW`);
        this.load.audio('splat', `https://play.rosebud.ai/assets/Splat.mp3.mp3?yJQr`);
        this.load.audio('ooh', `https://play.rosebud.ai/assets/Oooh.mp3.mp3?17iv`);

        // Add a load progress event listener
        this.load.on('progress', (value) => {
            console.log('Loading... ' + Math.round(value * 100) + '%');
        });
    }

    create() {
        this.playerHitCount = 0;
        this.loadingText.destroy();

        

        //Main Background
        this.backgrounds = [];
        for (let i = 0; i < 2; i++) {
            const bg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'fakBackground').setOrigin(0, 0);
            this.backgrounds.push(bg);
        }

        // Create Overlap1Background in the same manner as fakBackground
        this.overlap1Backgrounds = [];
        for (let i = 0; i < 2; i++) {
            const overlap1Bg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'Overlap1Background').setOrigin(0, 0);
            this.overlap1Backgrounds.push(overlap1Bg);
        }
        
        // Create OverlapBackground in the same manner as fakBackground
        this.overlapBackgrounds = [];
        for (let i = 0; i < 2; i++) {
            const overlapBg = this.add.tileSprite(0, 4819 * i, 800, 4819, 'OverlapBackground').setOrigin(0, 0);
            this.overlapBackgrounds.push(overlapBg);
        }

        this.anims.create({
            key: 'animateSprite',
            frames: this.anims.generateFrameNumbers('spriteImage', { start: 0, end: 5 }),
            frameRate: 20,
            repeat: -1
        });

        // Create four miniatures of sprite at the bottom right to represent lives
        for (let i = 0; i < 4; i++) {
            const xPosition = this.sys.game.config.width - 40 - i * 40;
            const miniatureSprite = this.add.image(xPosition, this.sys.game.config.height - 30, 'spriteImageMini');
            miniatureSprite.setScale(0.4);
            this.spriteLivesMiniatures.push(miniatureSprite);
        }

        // Create an animation for fakdude
        this.anims.create({
            key: 'animatefakdude',
            frames: this.anims.generateFrameNumbers('fakdude', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: -1
        });

        // Create an animation for Bluebike
        this.anims.create({
            key: 'animateBluebike',
            frames: this.anims.generateFrameNumbers('bluebike', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        // Create an animation for cookies
        this.anims.create({
            key: 'animateCookie',
            frames: this.anims.generateFrameNumbers('cookie', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.sprite = this.physics.add.sprite(400, this.sys.game.config.height / 2, 'spriteImage').play('animateSprite');
        this.sprite.setScale(0.3); // Scale the sprite to be 50% smaller
        this.sprite.setCircle(this.sprite.width / 4, this.sprite.width / 4, this.sprite.height / 4); // Set the collision circle to be centered around the sprite

        // Add and play background music
        this.fakSong = this.sound.add('fakSong');
        this.fakSong.play({ loop: true, volume: 0.9 }); // Lower volume by 50%

        this.cursors = this.input.keyboard.createCursorKeys();

        // Spawn bad girls every 2 seconds
        this.time.addEvent({
            delay: 1200,
            callback: () => {
                const fakdude = this.createfakdude();
                fakdude.setBlendMode(Phaser.BlendModes.OVERLAY); 

                this.sound.play('newoo', { volume: 0.7 });
                this.movefakdude(fakdude);
                this.physics.add.overlap(this.sprite, fakdude, (sprite, fakdude) => {
                    this.sound.play('splat');
                    this.createCookies(fakdude.x, fakdude.y);
                    fakdude.destroy();
                    this.playerHitCount++;
                    this.fadeOutBackground();

             // Remove a miniature sprite from the scene
            if (this.spriteLivesMiniatures.length > 0) {
                const lastSpriteMiniature = this.spriteLivesMiniatures.pop();
                lastSpriteMiniature.destroy();
            }

                    if (this.playerHitCount === 4) {
                        this.scene.start('GameOver');
                        this.fakSong.stop('fakSong');
                    }

                    if (!this.isZoomed) {
                        this.isZoomed = true;
                        this.cameras.main.zoomTo(2, 300, 'Power2');
                        this.time.delayedCall(500, () => {
                            this.cameras.main.zoomTo(1, 300, 'Power2');
                            this.isZoomed = false;
                        });
                    } else {
                        this.cameras.main.shake(250, 1);
                    }
                });
            },
            loop: true,
        });

        // Create the cookies group
        this.cookies = this.physics.add.group();

        // Add overlap detection for cookies
        this.physics.add.overlap(this.sprite, this.cookies, this.handleCookieCollision, null, this);

        // Spawn bluebikes every 15 seconds
        this.bluebikes = this.physics.add.group({
            classType: Phaser.Physics.Arcade.Sprite,
            maxSize: 10,
            runChildUpdate: true
        });
        this.time.addEvent({
            delay: 5000,
            callback: () => {
                this.spawnBluebike();
            },
            loop: true
        });

        // Add overlap detection for bluebikes
        this.physics.add.overlap(this.sprite, this.bluebikes, this.handleBluebikeCollision, null, this);

        // Set depth of OverlapBackground to be in front of sprite and badguys
        this.overlapBackgrounds.forEach(overlapBg => {
            overlapBg.setDepth(1);
        });
    }

    spawnBluebike() {
        const bluebike = this.physics.add.sprite(100, Phaser.Math.Between(0, this.sys.game.config.height), 'bluebike');
        bluebike.setScale(0.7); // Scale the sprite to be 50% smaller
        bluebike.setCircle(86.75, 86.75, 86.75);
        bluebike.play('animateBluebike');
        this.bluebikes.add(bluebike);
        bluebike.setVelocity(600, Phaser.Math.Between(-150, 150));
    }

    handleBluebikeCollision(sprite, bluebike) {
        bluebike.disableBody(true, true);
        this.sound.play('ooh');
        this.bluebikesCollected++;

        // Adjust the space between each blue bike and the scale of the tiny blue bike
        const xPosition = this.sys.game.config.width - 60- (this.bluebikesCollected - 1) * 90;
        const tinyBluebike = this.add.image(xPosition, 50, 'bluebike').setScale(0.3); // Scale down the tiny blue bike
        this.collectedBluebikes.push(tinyBluebike);


        if (this.bluebikesCollected === 4) {
            this.scene.start('HappyScene');
            this.fakSong.stop();
        }
    }


    createfakdude() {
        const fakdude = this.physics.add.sprite(Phaser.Math.Between(0, this.scale.width), 0, 'fakdude').play('animatefakdude');
        fakdude.setScale(0.8); // Scale the sprite to be 50% smaller
        fakdude.setCircle(fakdude.width / 4, fakdude.width / 4, fakdude.height / 4);
        fakdude.setFlip(Phaser.Math.Between(0, 1) === 1, false);
        fakdude.setAngle(Phaser.Math.Between(0, 80));
        return fakdude;
    }

    movefakdude(fakdude) {
        this.tweens.add({
            targets: fakdude,
            x: { value: Phaser.Math.Between(0, this.scale.width), duration: 3500 },
            y: { value: this.scale.height + fakdude.height, duration: 3500 },
            onComplete: () => { fakdude.destroy(); }
        });
    }

    createCookies(x, y) {
        for (let i = 0; i < 4; i++) {
            const cookie = this.cookies.create(x, y, 'cookie').play('animateCookie');
            cookie.setScale(0.25);
            cookie.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
        }
    }

    handleCookieCollision(sprite, cookie) {
        cookie.destroy();
        this.isCameraShaking = true;
        this.cameras.main.shake(200);
        this.time.delayedCall(200, () => {
            this.isCameraShaking = false;
        });
    }

    fadeOutBackground() {
        const alphaReduction = 0.3 * this.playerHitCount;
        const newAlpha = Math.max(0, 1 - alphaReduction);
        this.backgrounds.forEach(bg => {
            bg.setAlpha(newAlpha);
        });
    }

    update(time, delta) {
        if (this.cursors.left.isDown && this.sprite.x > 0) {
            this.sprite.x -= 5;
            this.sprite.angle -= 4;
        } else if (this.cursors.right.isDown && this.sprite.x < this.sys.game.config.width) {
            this.sprite.x += 5;
            this.sprite.angle += 4;
        }

        if (this.cursors.up.isDown && this.sprite.y > 0) {
            this.sprite.y -= 5;
            this.fallSpeed = Math.max(5, this.fallSpeed - 0.1);
        } else if (this.cursors.down.isDown && this.sprite.y < this.sys.game.config.height) {
            this.sprite.y += 3;
            this.fallSpeed = Math.min(15, this.fallSpeed + 0.1);
        } else {
            this.fallSpeed = this.defaultFallSpeed;
        }

        // Make the fakBackgrounds move
        this.backgrounds.forEach(bg => {
            bg.y -= this.fallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });

        // Make the overlap1Backgrounds move faster by increasing the fall speed
        const overlap1FallSpeed = this.fallSpeed * 1.3; // Increase the fall speed for overlap1Backgrounds
        this.overlap1Backgrounds.forEach(bg => {
            bg.y -= overlap1FallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });

        // Make the overlapBackgrounds move faster by increasing the fall speed
        const overlapFallSpeed = this.fallSpeed * 2; // Increase the fall speed for overlapBackgrounds
        this.overlapBackgrounds.forEach(bg => {
            bg.y -= overlapFallSpeed;
            if (bg.y < this.cameras.main.scrollY - 4819) {
                bg.y += 4819 * 2;
            }
            bg.tilePositionY = this.cameras.main.scrollY;
        });
    }
}

class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOver' });
    }

    preload() {
    this.load.image('background2', `https://play.rosebud.ai/assets/paris-eifel-tower.jpg?hsrl`);
    this.load.image('Void', `https://play.rosebud.ai/assets/try-again.png?OgpG`);
    this.load.image('PlayAgain', `https://play.rosebud.ai/assets/try-again.png?OgpG`);
    this.load.audio('HappySong', `https://play.rosebud.ai/assets/trailer-action-mystery-212194.mp3.crdownload?RUjK`)

    }

    create() {
         // Play the music
        this.music = this.sound.add('HappySong');
        this.music.play({
            loop: true // Loop the music
        });

        // Load and display the background
        this.add.image(400, 300, 'background2');

        // Load and display the title, entering from the top of the screen over 200ms
        this.title = this.add.image(400, 300, 'Void');
    

        // Load and display the spacebar, fading in and flashing
        this.spacebar = this.add.image(400, 300, 'PlayAgain')
            .setAlpha(0)
            .setInteractive();

        this.tweens.add({
            targets: this.spacebar,
            alpha: 1,
            yoyo: true,
            repeat: -1,
            duration: 500
        });

        // Listen for spacebar press to transition to the StoryScene
        this.input.keyboard.on('keydown-SPACE', () => {
        this.music.stop('HappySong');
        this.scene.start('StartScene');
        });
    }
}

class HappyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'HappyScene' }); // Set the key to 'HappyScene'
    }

    preload() {
        this.load.spritesheet('yellobikeSprite', `https://play.rosebud.ai/assets/BikeSpriteSheet.png.png?c0y7`, { frameWidth: 347, frameHeight: 347 });
        this.load.spritesheet('littleGuy2', `https://play.rosebud.ai/assets/LittleGuy.png.png?qkhI`, { frameWidth: 347, frameHeight: 347 });  // Load the LittleGuy2 sprite sheet
        this.load.image('endBackground', `https://play.rosebud.ai/assets/EndBackground.png.png?KUcG`);  // Load the EndBackground image
        this.load.image('FloatClouds', `https://play.rosebud.ai/assets/EndBackgroundClouds.png.png?McHc`);  // Load the EndBackground image
        this.load.audio('ForestSong', `https://play.rosebud.ai/assets/TheForest.mp3.mp3?wWnU`)
    }

    create() {
        // Play the music
        this.music = this.sound.add('ForestSong');
        this.music.play({
            loop: true // Loop the music
        });

        // Set world bounds to be larger than the visible game area
        this.physics.world.setBounds(0, 0, 1200, 600);

        // Add the EndBackground image as a tile sprite and make it a scrolling background
        this.bg = this.add.tileSprite(0, 0, 800, 600, 'endBackground').setOrigin(0, 0);

        // Add the clouds image as a tile sprite and make it a scrolling background
        this.clouds = this.add.tileSprite(0, 0, 800, 600, 'FloatClouds').setOrigin(0, 0).setDepth(2);

        this.yelloBike = this.physics.add.sprite(400, 300, 'yellobikeSprite').setDepth(1);

        // Set the x velocity to a negative value to move the bike from right to left
        this.yelloBike.body.setVelocity(Phaser.Math.Between(100, 200), 0);

        // Reduce the size of the bounding box
        this.yelloBike.body.setSize(this.yelloBike.width * 0.5, this.yelloBike.height * 0.5);

        // Create an animation for Bike
        this.anims.create({
            key: 'animateBike',
            frames: this.anims.generateFrameNumbers('yellobikeSprite', { start: 0, end: 5 }),
            frameRate: 8,
            repeat: -1
        });

        // Play the animation on the sprite
        this.yelloBike.anims.play('animateBike', true);

        // Add a flag to check if the bike has just re-entered the screen
        this.yelloBike.setData('justEntered', false);

        // Add the LittleGuy2 sprite and animate it
        this.littleGuy2 = this.physics.add.sprite(400, 300, 'littleGuy2').setScale(0.3).setDepth(0); // Set the scale to 0.3

        // Set an initial velocity for the sprite
        this.littleGuy2.body.setVelocity(Phaser.Math.Between(100, 200), Phaser.Math.Between(100, 200));

        // Set the sprite to collide with the world bounds and bounce
        this.littleGuy2.setCollideWorldBounds(true);
        this.littleGuy2.setBounce(1); // Set bounce to 1 for a perfect elastic collision
        this.littleGuy2.setAngularVelocity(60); // Set angular velocity for spin

        // On collision with world bounds, change the velocity direction
        this.littleGuy2.body.onWorldBounds = true;
        this.littleGuy2.body.world.on('worldbounds', (body) => {
            if (body.gameObject === this.littleGuy2) {
                let angle = Phaser.Math.Between(0, 360);
                let speed = Phaser.Math.Between(100, 200);
                this.physics.velocityFromAngle(angle, speed, this.littleGuy2.body.velocity);
            }
        }, this);

        // Reduce the size of the bounding box
        this.littleGuy2.body.setSize(this.littleGuy2.width * 0.5, this.littleGuy2.height * 0.5);

        // Create an animation for LittleGuy2
        this.anims.create({
            key: 'animateLittleGuy2',
            frames: this.anims.generateFrameNumbers('littleGuy2', { start: 0, end: 3 }),
            frameRate: 8,
            repeat: -1
        });

        // Play the animation on the sprite
        this.littleGuy2.anims.play('animateLittleGuy2', true);

        // Create the text lines and initially hide them. Center them on the screen.
        this.line1 = this.add.text(this.cameras.main.centerX, 50, "Congratulations, you have escaped your warzone!", { fontSize: '20px', fill: '#000', fontFamily: 'Courier' }).setOrigin(0.5, 0).setVisible(false);
        this.line2 = this.add.text(this.cameras.main.centerX, 50, "Don't forget to keep your passport safe,", { fontSize: '20px', fill: '#000', fontFamily: 'Courier' }).setOrigin(0.5, 0).setVisible(false);
        this.line2_2 = this.add.text(this.cameras.main.centerX, 75, "and keep dreaming of your fame and fortune.", { fontSize: '20px', fill: '#000', fontFamily: 'Courier' }).setOrigin(0.5, 0).setVisible(false);
        this.line3 = this.add.text(this.cameras.main.centerX, 50, "This game was created by .", { fontSize: '20px', fill: '#000', fontFamily: 'Courier' }).setOrigin(0.5, 0).setVisible(false);
        this.line4 = this.add.text(this.cameras.main.centerX, 50, "All artwork and original music by .", { fontSize: '20px', fill: '#000', fontFamily: 'Courier' }).setOrigin(0.5, 0).setVisible(false);
        this.line5 = this.add.text(this.cameras.main.centerX, 50, "Coding assistance and support generously provided by", { fontSize: '20px', fill: '#000', fontFamily: 'Courier' }).setOrigin(0.5, 0).setVisible(false);
        this.line5_2 = this.add.text(this.cameras.main.centerX, 75, "the robots and humans of Rosebud.ai", { fontSize: '20px', fill: '#000', fontFamily: 'Courier' }).setOrigin(0.5, 0).setVisible(false);

        // Display each line one after another, each after a delay of 3 seconds
        this.time.delayedCall(3000, () => { this.line1.setVisible(true); });
        this.time.delayedCall(10000, () => { this.line1.setVisible(false); this.line2.setVisible(true); this.line2_2.setVisible(true); });
        this.time.delayedCall(14000, () => { this.line2.setVisible(false); this.line2_2.setVisible(false); this.line3.setVisible(true); });
        this.time.delayedCall(18000, () => { this.line3.setVisible(false); this.line4.setVisible(true); });
        this.time.delayedCall(22000, () => { this.line4.setVisible(false); this.line5.setVisible(true); this.line5_2.setVisible(true); });
        this.time.delayedCall(29000, () => { this.line5.setVisible(false); this.line5_2.setVisible(false); });
    }

    update() {

         // Update the position of the clouds
        this.clouds.tilePositionX += 2.5; // Scroll faster than the background

        // Wrap the yelloBike with appropriate padding and useBounds set to true within the larger world bounds
        this.physics.world.wrap(this.yelloBike, this.yelloBike.width * 0.5, true);

        // Change the scale of the bike when it re-enters the screen
        if ((this.yelloBike.x < 0 || this.yelloBike.x > 1200) && !this.yelloBike.getData('justEntered')) {
            let scale = Phaser.Math.Between(1, 2); // Ensure the bike is always visible
            this.yelloBike.setScale(scale);
            this.yelloBike.setData('justEntered', true);
        } else if (this.yelloBike.x > 200 && this.yelloBike.x < 1000) {
            this.yelloBike.setData('justEntered', false);
        }

        // Scroll the background
        this.bg.tilePositionX += 1;
    }
}

const config = {
    type: Phaser.AUTO,
    parent: 'renderDiv',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
    },
    scene: [StartScene, StoryScene, Scene1, Scene2, Scene3, Scene4, HappyScene, GameOver ]
};

window.phaserGame = new Phaser.Game(config);