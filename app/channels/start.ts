import { BaseTexture, Color4, FxaaPostProcess, MeshBuilder, PassPostProcess, PostProcess, Scene, Texture, UniversalCamera, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Control, Image, Line, TextBlock } from "babylonjs-gui";
import { World, WorldBuilder } from "encompass-ecs";
import { RippleEffectComponent } from "../components/ripple_effect";
import { SceneComponent } from "../components/scene";
import { RippleEffectEngine } from "../engines/ripple_effect";
import { StreamManager } from "../helpers/stream_manager";
import { SceneRenderer } from "../renderers/scene";
import { Channel } from "./channel";

export class StartChannel extends Channel {
    private world: World;

    public constructor(scene: Scene, stream_manager: StreamManager) {
        super(scene, stream_manager);

        const world_builder = new WorldBuilder();

        world_builder.add_engine(RippleEffectEngine);

        world_builder.add_renderer(SceneRenderer);

        const scene_entity = world_builder.create_entity();
        const scene_component = scene_entity.add_component(SceneComponent);
        scene_component.scene = scene;

        scene.clearColor = new Color4(164 / 255, 213 / 255, 245 / 255, 1);

        const camera = new UniversalCamera("startChannelCamera", new Vector3(), scene);
        camera.fov = 1.3;

        const plane = MeshBuilder.CreatePlane("texturePlane", {
            size: 600
        });
        plane.position.set(0, 0, 0);
        scene.addMesh(plane);

        camera.position.z = -225;

        const ui = AdvancedDynamicTexture.CreateForMesh(plane, 600, 600, false);
        ui.background = "#a4d5f5";

        const logo_header = new Image("logoHeader", "/assets/images/logo_header.png");
        logo_header.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        logo_header.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        logo_header.stretch = Image.STRETCH_UNIFORM;
        logo_header.top = -60;
        logo_header.width = "80%";
        ui.addControl(logo_header);

        const line = new Line("headerLine");
        line.x1 = 50;
        line.y1 = 320;
        line.x2 = 550;
        line.y2 = 320;
        line.lineWidth = 1;
        line.color = "#6ba8e5";
        ui.addControl(line);

        const spacebar_instructions = new TextBlock("spacebar", "Spacebar| Toggle Play");
        spacebar_instructions.fontFamily = "DolphinOceanWave";
        spacebar_instructions.fontSize = 32;
        spacebar_instructions.color = "white";
        spacebar_instructions.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        spacebar_instructions.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        spacebar_instructions.outlineColor = "black";
        spacebar_instructions.outlineWidth = 2;
        spacebar_instructions.top = 50;
        ui.addControl(spacebar_instructions);

        const right_arrow = new TextBlock("rightArrow", "Right Arrow / Change Channel");
        right_arrow.fontFamily = "DolphinOceanWave";
        right_arrow.fontSize = 32;
        right_arrow.color = "white";
        right_arrow.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        right_arrow.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        right_arrow.outlineColor = "black";
        right_arrow.outlineWidth = 2;
        right_arrow.top = 100;
        ui.addControl(right_arrow);

        /*
        const text = new TextBlock("pressAnyKey", "Press any key to begin");
        text.fontFamily = "DolphinOceanWave";
        text.fontSize = 32;
        text.color = "white";
        text.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        text.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        text.top = 50;
        text.outlineColor = "black";
        text.outlineWidth = 2;
        ui.addControl(text);
        */

        // new FxaaPostProcess("fxaa", 1.0, camera);

        const postprocess_entity = world_builder.create_entity();
        const ripple_component = postprocess_entity.add_component(RippleEffectComponent);
        ripple_component.time = 0;
        const ripple_effect = new PostProcess(
            "ripple",
            "./assets/shaders/ripple",
            ["time", "screenSize"],
            ["iChannel1", "iChannel2"],
            1.0,
            camera
        );
        const noise_texture = new Texture("./assets/images/rgba-noise.png", scene);
        const cube_map_texture = new Texture("./assets/images/cubemap.png", scene);

        ripple_effect.onApply = effect => {
            effect.setFloat2("screenSize", window.innerWidth, window.innerHeight);
            effect.setTexture("iChannel1", noise_texture);
            effect.setTexture("iChannel2", cube_map_texture);
            effect.setFloat("time", ripple_component.time);
        };
        ripple_component.effect = ripple_effect;

        this.channelPass = new PassPostProcess("pass", 1.0, camera);

        this.world = world_builder.build();
    }

    public update(dt: number) {
        this.world.update(dt);
    }

    public draw() {
        this.world.draw();
    }
}
