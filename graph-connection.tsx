import { Line, LineProps, Shape, ShapeProps, Txt } from "@motion-canvas/2d/lib/components";
import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SignalValue, SimpleSignal } from "@motion-canvas/core/lib/signals";
import { GraphNode, GraphNodeProps } from "./graph-node";

export interface GraphConnectionProps extends LineProps {
  startNode: SignalValue<GraphNode>
  endNode: SignalValue<GraphNode>
  text?: SignalValue<string>
}

export class GraphConnection extends Line { 
  @initial(null)
  @signal()
  public declare readonly startNode: SimpleSignal<
    GraphNode,
    this
  >

  @initial(null)
  @signal()
  public declare readonly endNode: SimpleSignal<
    GraphNode,
    this
  >

  @initial('')
  @signal()
  public declare readonly text: SimpleSignal<
      string,
      this
  >;
  
  private fadedIn: boolean = false;

  public constructor(props?: GraphConnectionProps){
    super({
      points: () => [this.startNode().position(), this.endNode().position()],
      stroke: '242424',
      lineWidth: 10,
      ...props,
    });

    this.add(
      <Txt
        text={this.text}
        position={this.getPointAtPercentage(0.5).position}
        stroke={"141414"}
        lineWidth={20}
        strokeFirst
        fontSize={40}
        fontFamily={"Inter"}
        fill={"D6D6D6"}
      />
    )
  }

  public* fadeIn(useStart: boolean){
    if(this.fadedIn) {
      yield;
      return;
    }
    this.fadedIn = true;
    this.opacity(1)
    if(useStart){
      this.end(0)
      yield* this.end(1, 1)
    } else {
      this.start(1)
      yield* this.start(0, 1)
    }
  }
}