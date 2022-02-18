import {MainScene} from "./scenes/MainScene";
// @ts-ignore
import UIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
// @ts-ignore
import JoyStickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";
import Center = Phaser.Scale.Center;


export let config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
        parent: 'catapults-battle',
        width: 1280,
        height: 600,
        autoCenter: Center.CENTER_BOTH,
        autoRound: true,
    },
    backgroundColor: '#527d56',
    physics: {
        default: 'matter',
        matter: {
            debug: false,
            gravity: { y: 0.4 }
        }
    },
    scene: MainScene,
    dom: {
        createContainer: true
    },
    parent: "parent",
    plugins: {
        scene: [{
            key: 'rexUI',
            plugin: UIPlugin,
            sceneKey: 'rexUI',
            mapping: 'rexUI'
        },{
            key: 'rexJoyStick',
            plugin: JoyStickPlugin,
            sceneKey: 'rexJoyStick',
            mapping: 'rexJoyStick'
        },
        ]
    }
}

new Phaser.Game(config);

