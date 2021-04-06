import {Scene} from "phaser";

export class YesNoDialog {
    private scene: Scene;
    private title: string;
    private text: string;
    private yesCallback: Function;
    private noCallback: Function;

    constructor(scene: Scene, title: string, text: string, yesCallback: Function, noCallback: Function) {
        this.scene = scene;
        this.title = title;
        this.text = text;
        this.yesCallback = yesCallback;
        this.noCallback = noCallback;
        this.show();
    }

    private show() {

        let rectangle = this.scene.add.rectangle(-100, -100, 2000, 4000,
            0xffffff, 0.5).setOrigin(0, 0);
        rectangle.setInteractive();


        // @ts-ignore
        let dialog = this.scene.rexUI.add.dialog({
            x: 360,
            y: 500,
            // @ts-ignore
            background: this.scene.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x1565c0),
            // @ts-ignore
            title: this.title.length == 0 ? undefined : this.scene.rexUI.add.label({
                // @ts-ignore
                background: this.scene.rexUI.add.roundRectangle(0, 0, 100, 40, 20, 0x003c8f),
                text: this.scene.add.text(0, 0, this.title, {
                    fontSize: '24px'
                }),
                space: {
                    left: 15,
                    right: 15,
                    top: 10,
                    bottom: 10
                }
            }),

            content: this.scene.add.text(0, 0, this.text, {
                fontSize: '24px'
            }),

            actions: [
                createLabel(this.scene, 'Yes'),
                createLabel(this.scene, 'No')
            ],

            space: {
                title: 25,
                content: 25,
                action: 15,

                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
            },

            align: {
                actions: 'left', // 'center'|'left'|'right'
            },

            expand: {
                content: false, // Content is a pure text object
            }
        })
            .layout()
            // .drawBounds(this._scene.add.graphics(), 0xff0000)
            .popUp(100);

        dialog.on("button.click", (button: any, groupName: any, index: number) => {
            if (index === 0) {
                //Yes
                this.yesCallback()
                rectangle.destroy()
                dialog.destroy()
            } else if (index === 1) {
                //No
                this.noCallback()
                rectangle.destroy()
                dialog.destroy()
            }
        }, this).on('button.over', function (button: any) {
            button.getElement('background').setStrokeStyle(1, 0xffffff);
        }).on('button.out', function (button: any) {
            button.getElement('background').setStrokeStyle();
        });
        dialog.setAlpha(0.75);


    }

}

function createLabel(scene: Scene, text: string) {
    // @ts-ignore
    return scene.rexUI.add.label({
        // width: 40,
        // height: 40,
        // @ts-ignore
        background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 20, 0x5e92f3),
        text: scene.add.text(0, 0, text, {
            fontSize: '24px'
        }),
        space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10
        }
    });
}