import "../../assets/catapult4.png"
import "../../assets/rock.png"
import "../../assets/ground.png"
import "../../assets/castle.png"
import "../../assets/fullscreen.png"
import {Scene} from "phaser";
import SettingsConfig = Phaser.Types.Scenes.SettingsConfig;
import CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;
import Sprite = Phaser.Physics.Matter.Sprite;
import Image = Phaser.Physics.Matter.Image;


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

    constructor() {
        super(sceneConfig);
    }

    public preload() {
        this.load.spritesheet('catapult', './assets/catapult4.png', {frameWidth: 129, frameHeight: 107});
        this.load.spritesheet('rock', './assets/rock.png', {frameWidth: 22, frameHeight: 28});
        this.load.image('ground', './assets/ground.png');
        this.load.image('castle', './assets/castle.png');
        this.load.image('fullscreen', './assets/fullscreen.png');
    }

    public create() {

        this.matter.world.setBounds(0, 0, 1280, 600, 64, false, false, false, true);

        let castle = this.matter.add.sprite(650, 370, "castle");
        castle.setScale(0.2);
        castle.setStatic(true);

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

        this.ground = this.matter.add.image(640, 550, "ground")
            .setSize(1280, 86)
            .setScale(1.5);

        this.catapult = this.matter.add.sprite(100, 480, "catapult")
            .setVisible(true)
            .setInteractive()
            .setScale(0.5);

        this.catapultEnemy = this.matter.add.sprite(1100, 480, "catapult")
            .setVisible(true)
            .setInteractive()
            .setFlipX(true)
            .setScale(0.5);

        this.rock = this.matter.add.sprite(this.catapult.x + 5, this.catapult.y - 30, "rock")
            .setActive(false)
            .setScale(0.6)
            .setVisible(false)
            .setCircle(4) as Sprite;
        this.rock.setFrictionAir(0.000);
        this.rock.setFriction(1);
        this.rock.visible = false;
        this.rock.setMass(2);

        this.rock.setOnCollideWith(this.catapultEnemy, () => {

        });

        this.rock.setOnCollideWith(this.ground, () => {
            this.rock.setVelocity(0);
        });

        this.catapult.on("pointerup", () => {
            this.time.delayedCall(800, () => {
                this.rock.setVisible(true)
                    .setPosition(this.catapult.x + 5, this.catapult.y - 30)
                    .setFriction(1);
                this.rock.setVelocity(10, -2);

            });
            this.catapult.anims.play("catapult");
        });

        this.catapultEnemy.on("pointerup", () => {
            this.time.delayedCall(800, () => {
                this.rock.setVisible(true)
                    .setPosition(this.catapultEnemy.x - 2, this.catapultEnemy.y - 30)
                    .setFriction(1);
                this.rock.setVelocity(-10, -2);

            });
            this.catapultEnemy.anims.play("catapult");
        });


        this.anims.create({
            key: 'catapult',
            frames: this.anims.generateFrameNumbers('catapult', {first: 0, end: 9, start: 0}),
            frameRate: 8,
            yoyo: false,
            repeat: 0,
            hideOnComplete: false
        });

        this.anims.create({
            key: 'rock',
            frames: this.anims.generateFrameNumbers('rock', {first: 0, end: 7, start: 0}),
            frameRate: 8,
            yoyo: false,
            repeat: -1,
            hideOnComplete: false
        });

        this.cursorKeys = this.input.keyboard.createCursorKeys();

        ///////////////////////////////////

        const COLOR_PRIMARY = 0x4e342e;
        const COLOR_LIGHT = 0x7b5e57;
        const COLOR_DARK = 0x260e04;

        // @ts-ignore
        let numberBar = this.rexUI.add.numberBar({
            x: 170,
            y: 50,
            width: 300, // Fixed width
            // @ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
            icon: this.add.text(0, 0, "Force"),

            slider: {
                // width: 120, // Fixed width
                // @ts-ignore
                track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
                // @ts-ignore
                indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
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

        //////

        // @ts-ignore
        let numberBarAngle = this.rexUI.add.numberBar({
            x: 170,
            y: 100,
            width: 300, // Fixed width
            // @ts-ignore
            background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_DARK),
            icon: this.add.text(0, 0, "Angle"),

            slider: {
                // width: 120, // Fixed width
                // @ts-ignore
                track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_PRIMARY),
                // @ts-ignore
                indicator: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),
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

        ////////////////////////////////////////////////////

        // @ts-ignore
        this.joyStick = this.rexJoyStick.add(this.scene, {
            x: 530,
            y: 75,
            radius: 50,
            base: this.add.circle(0, 0, 50, 0x888888),
            thumb: this.add.circle(0, 0, 20, 0xcccccc),
            dir: 'left&right',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        });
        this.joyStickCursorKeys = this.joyStick.createCursorKeys();


        /////////////////////


        // @ts-ignore
        let buttonFire = this.rexUI.add.buttons({
            x: 390, y: 75,
            width: 50,
            height: 100,
            orientation: 'x',

            buttons: [
                // @ts-ignore
                this.rexUI.add.label({
                    width: 40,
                    height: 40,
                    // @ts-ignore
                    background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 20, COLOR_LIGHT),
                    text: this.add.text(0, 0, 'Fire', {
                        fontSize: 18
                    }),
                    space: {
                        left: 20,
                        right: 20,
                    },
                    align: 'center',
                    toggleButtonEnable: true
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
                this.rock.setVelocity(30 * numberBar.getValue() * (1 - numberBarAngle.getValue()), -30 * numberBar.getValue() * numberBarAngle.getValue());

            });
            this.catapult.anims.play("catapult");
        });

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
}
