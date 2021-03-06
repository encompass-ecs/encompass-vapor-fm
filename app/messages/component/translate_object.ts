import { ComponentMessage, Message } from "encompass-ecs";
import { MeshComponent } from "../../components/mesh_component";

export class TranslateObjectMessage extends Message
  implements ComponentMessage {
  public component: MeshComponent;
  public x: number;
  public y: number;
  public z: number;
}
