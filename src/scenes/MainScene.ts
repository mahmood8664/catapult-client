import "../../assets/catapult4.png"
import "../../assets/catapult5.png"
import "../../assets/rock.png"
import "../../assets/ground.png"
import "../../assets/castle.png"
import "../../assets/fullscreen.png"
import "../../assets/wind_power.png"
import {Scene} from "phaser";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import Sprite = Phaser.Physics.Matter.Sprite;
import Image = Phaser.Physics.Matter.Image;
import Vector2 = Phaser.Math.Vector2;


const sceneConfig: SettingsConfig = {
    active: false,
    visible: false,
    key: 'MainScene',
};

export class MainScene extends Scene {

    private catapult!: Sprite;
    private catapultEnemy!: Sprite;
    private rock!: Sprite;
    private ground!: Image;
    private cursorKeys!: CursorKeys;
    private joyStickCursorKeys!: any;
    private joyStick!: any;
    private numberBar!: any;
    private numberBarAngle!: any;
    private brokenCatapult!: Phaser.GameObjects.Sprite;

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.load.spritesheet('catapult', './assets/catapult4.png', {frameWidth: 129, frameHeight: 107});
        this.load.spritesheet('catapultBroken', './assets/catapult5.png', {frameWidth: 156, frameHeight: 146});
        this.load.spritesheet('rock', './assets/rock.png', {frameWidth: 22, frameHeight: 28});
        this.load.image('ground', './assets/ground.png');
        this.load.image('castle', './assets/castle.png');
        this.load.image('fullscreen', './assets/fullscreen.png');
        this.load.image('wind_power', './assets/wind_power.png');
    }

    public create() {
        this.matter.world.setBounds(0, 0, 1280, 600, 64, false, false, false, true);

        this.createCastle();
        this.createFullScreenBtn();
        this.createGround();
        this.createCatapult();
        this.createBrokenCatapult();
        this.createEnemyCatapult();
        this.createRock();
        this.setRockColliderWithCatapultEnemy();
        this.setRockColliderWithGround();
        this.createCatapultAnimation();
        this.createBrokenCatapultAnimation();
        this.createRockAnimation();
        this.createForceNumberBar();
        this.createAngleNumberBar();
        this.createJoyStick();
        this.createFireBtn();

        this.cursorKeys = this.input.keyboard.createCursorKeys();
    }

    /**
     * create fire catapult button. use RexUI button.
     * Fine more details in {@link https://rexrainbow.github.io/phaser3-rex-notes/docs/site/ui-overview/}
     * @private
     */
    private createFireBtn() {
        let force = MainScene.randomIntFromInterval(0, 5) * (MainScene.randomOneOrNegativeOne());
        let wind = this.add.image(650, 200, "wind_power");
        wind.setAlpha(0.2);
        wind.setScale(0.05 * force);

        // @ts-ignore
        let buttonFire = this.rexUI.add.buttons({
            x: 720, y: 50,
            width: 50,
            height: 80,
            orientation: 'x',
            buttons: [
                // @ts-ignore
                this.rexUI.add.label({
                    width: 40,
                    height: 40,
                    // @ts-ignore
                    background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x7b5e57),
                    text: this.add.text(0, 0, 'Fire', {
                        fontSize: 18
                    }),
                    space: {
                        left: 20,
                        right: 20,
                    },
                    align: 'center',
                    toggleButtonEnable: true,
                    alpha: 0.1,
                })
            ],

            space: {
                left: 10, right: 10, top: 10, bottom: 10,
                item: 1
            },
            expand: true
        }).layout();

        buttonFire.on('button.click', () => {
            this.time.delayedCall(800, () => {
                this.rock.setVisible(true)
                    .setPosition(this.catapult.x + 5, this.catapult.y - 30)
                    .setFriction(1);
                this.rock.setVelocity(0);

                this.rock.applyForce(new Vector2(0.2 * this.numberBar.getValue() * (1 - this.numberBarAngle.getValue()),
                    -0.2 * this.numberBar.getValue() * this.numberBarAngle.getValue()));

                this.rock.setFriction(0.005, 0.001 * force, 0);
                this.rock.setBounce(0);

            });
            this.catapult.anims.play("catapult");
        });
    }

    /**
     * Create joystick to move catapults.
     * Joystick is given from rexUI
     * @private
     */
    private createJoyStick() {
        // @ts-ignore
        this.joyStick = this.rexJoyStick.add(this.scene, {
            x: 900,
            y: 50,
            radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 20, 0xcccccc),
            dir: 'left&right',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        });
        this.joyStickCursorKeys = this.joyStick.createCursorKeys();
    }

    /**
     * Create catapult angle number bar. Number Bar is given from rexUI
     * @private
     */
    private createAngleNumberBar() {
        // @ts-ignore
        let numberBarAngle = this.rexUI.add.numberBar({
            x: 500,
            y: 50,
            width: 300, // Fixed width
            // @ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x260e04),
            icon: this.add.text(0, 0, "Angle"),

            slider: {
                // width: 120, // Fixed width
                // @ts-ignore
                track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4e342e),
                // @ts-ignore
                indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x7b5e57),
                input: 'click',
            },

            text: this.add.text(0, 0, '').setFixedSize(35, 0),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,
                icon: 10,
                slider: 10,
            },

            // @ts-ignore
            valuechangeCallback: function (value, oldValue, numberBar) {
                numberBar.text = Math.round(Phaser.Math.Linear(0, 90, value));
            },
        }).layout();
        numberBarAngle.setValue(45, 0, 100);
        this.numberBarAngle = numberBarAngle;
    }

    /**
     * Create catapult force number bar. Number Bar is given from rexUI
     * @private
     */
    private createForceNumberBar() {
        // @ts-ignore
        let numberBar = this.rexUI.add.numberBar({
            x: 170,
            y: 50,
            width: 300, // Fixed width
            // height: 100,
            // @ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x260e04),
            icon: this.add.text(0, 0, "Force"),
            slider: {
                // width: 120, // Fixed width
                // height: 50,
                // @ts-ignore
                track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x4e342e),
                // @ts-ignore
                indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x7b5e57),
                input: 'click',
            },

            text: this.add.text(0, 0, '').setFixedSize(35, 0),

            space: {
                left: 10,
                right: 10,
                top: 10,
                bottom: 10,

                icon: 10,
                slider: 10,
            },

            // @ts-ignore
            valuechangeCallback: function (value, oldValue, numberBar) {
                numberBar.text = Math.round(Phaser.Math.Linear(0, 100, value));
            },
        }).layout();
        numberBar.setValue(50, 0, 100);
        this.numberBar = numberBar;
    }

    /**
     * Create rock circling around itself when catapult throw it
     * @private
     */
    private createRockAnimation() {
        this.anims.create({
            key: 'rock',
            frames: this.anims.generateFrameNumbers('rock', {first: 0, end: 7, start: 0}),
            frameRate: 8,
            yoyo: false,
            repeat: -1,
            hideOnComplete: false
        });
    }

    /**
     * Create catapult destroying animation
     * @private
     */
    private createBrokenCatapultAnimation() {
        this.anims.create({
            key: 'BrokenCatapult',
            frames: this.anims.generateFrameNumbers('catapultBroken', {first: 0, end: 8, start: 0}),
            frameRate: 5,
            yoyo: false,
            repeat: 0,
            hideOnComplete: false
        });
    }

    /**
     * Create catapult animation when it throw rock
     * @private
     */
    private createCatapultAnimation() {
        this.anims.create({
            key: 'catapult',
            frames: this.anims.generateFrameNumbers('catapult', {first: 0, end: 9, start: 0}),
            frameRate: 8,
            yoyo: false,
            repeat: 0,
            hideOnComplete: false
        });
    }

    /**
     * handler for hitting rock with ground
     * @private
     */
    private setRockColliderWithGround() {
        this.rock.setOnCollideWith(this.ground, () => {
            this.rock.setVelocity(0);
        });
    }

    /**
     * handler for hitting rock with enemy's catapult
     * @private
     */
    private setRockColliderWithCatapultEnemy() {
        this.rock.setOnCollideWith(this.catapultEnemy, () => {
            this.brokenCatapult.setVisible(true);
            this.brokenCatapult.setX(this.catapultEnemy.x);
            this.brokenCatapult.setY(this.catapultEnemy.y + 10);
            this.brokenCatapult.anims.play("BrokenCatapult");
            this.catapultEnemy.visible = false;
        });
    }

    /**
     * Create rock sprite
     * @private
     */
    private createRock() {
        this.rock = this.matter.add.sprite(this.catapult.x + 5, this.catapult.y - 30, "rock")
            .setActive(false)
            .setScale(0.6)
            .setVisible(false)
            .setCircle(4) as Sprite;
        this.rock.visible = false;
        this.rock.setMass(3);
    }

    /**
     * Create enemy catapult sprite
     * @private
     */
    private createEnemyCatapult() {
        this.catapultEnemy = this.matter.add.sprite(1100, 480, "catapult")
            .setVisible(true)
            .setInteractive()
            .setFlipX(true)
            .setScale(0.5);
    }

    /**
     * Create broken catapult sprite
     * @private
     */
    private createBrokenCatapult() {
        this.brokenCatapult = this.add.sprite(100, 480, "catapultBroken")
            .setVisible(false)
            .setScale(0.5);
    }

    /**
     * Create catapult
     * @private
     */
    private createCatapult() {
        this.catapult = this.matter.add.sprite(100, 480, "catapult")
            .setVisible(true)
            .setInteractive()
            .setScale(0.5);
    }

    /**
     * Create ground
     * @private
     */
    private createGround() {
        this.ground = this.matter.add.image(640, 550, "ground")
            .setSize(1280, 86)
            .setScale(1.5);
    }

    /**
     * Create full screen button and add click handler function
     * @private
     */
    private createFullScreenBtn() {
        let fullscreen = this.add.sprite(1250, 30, "fullscreen").setScale(0.2).setInteractive();
        fullscreen.on("pointerup", () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }

    /**
     * Create castle sprite
     * @private
     */
    private createCastle() {
        let castle = this.matter.add.sprite(650, 370, "castle");
        castle.setScale(0.2);
        castle.setStatic(true);
    }

    public update() {
        if (this.cursorKeys.right?.isDown && this.catapult.x < 1200) {
            this.catapult.setX(this.catapult.x + 2);
        }

        if (this.cursorKeys.left?.isDown && this.catapult.x > 20) {
            this.catapult.setX(this.catapult.x - 2);
        }
        this.joyStickCursorCheck();
    }

    /**
     * check if joystick button is down, if so then move catapult
     * @private
     */
    private joyStickCursorCheck() {
        for (let name in this.joyStickCursorKeys) {
            // noinspection JSUnfilteredForInLoop
            if (this.joyStickCursorKeys[name].isDown) {
                // noinspection JSUnfilteredForInLoop
                if (name.toLowerCase() === "left" && this.catapult.x > 20) {
                    this.catapult.setX(this.catapult.x - 2);
                } else { // noinspection JSUnfilteredForInLoop
                    if (name.toLowerCase() === "right" && this.catapult.x < 1200) {
                        this.catapult.setX(this.catapult.x + 2);
                    }
                }
            }
        }
    }

    /**
     * utility function for creating random between min and max. min and max included
     * @param min
     * @param max
     * @private
     */
    private static randomIntFromInterval(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    /**
     * Random between 1 and -1
     * @private
     */
    private static randomOneOrNegativeOne() {
        let number = this.randomIntFromInterval(1, 2);
        if (number == 1) {
            return 1;
        } else {
            return -1;
        }
    }
}
