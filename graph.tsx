import {
  Circle,
  Line,
  Shape,
  ShapeProps,
  Txt,
} from "@motion-canvas/2d/lib/components";
import {
  computed,
  initial,
  signal,
  vector2Signal,
} from "@motion-canvas/2d/lib/decorators";
import { Gradient } from "@motion-canvas/2d/lib/partials";
import {
  createSignal,
  SignalValue,
  SimpleSignal,
} from "@motion-canvas/core/lib/signals";
import { linear, map, tween } from "@motion-canvas/core/lib/tweening";
import {
  Color,
  PossibleColor,
  PossibleVector2,
  Spacing,
  Vector2,
} from "@motion-canvas/core/lib/types";
import {
  createRef,
  makeRef,
  range,
  useLogger,
} from "@motion-canvas/core/lib/utils";
import { Colors } from "../../styles/styles";
import { GraphNode } from "./graph-node";
import { GraphConnection } from "./graph-connection";
import { all, run, waitFor } from "@motion-canvas/core/lib/flow";

export interface GraphProps extends ShapeProps {
  connections?: SignalValue<number[][]>;
  fadeInStartNode?: SignalValue<number>;
  showIndex?: boolean;
  text?: SignalValue<string[]>
}

export class Graph extends Shape {
  @initial(null)
  @signal()
  public declare readonly connections: SimpleSignal<number[][], this>;

  @initial(null)
  @signal()
  public declare readonly fadeInStartNode: SimpleSignal<number, this>;

  @initial(null)
  @signal()
  public declare readonly showIndex: SimpleSignal<boolean, this>;

  @initial('')
  @signal()
  public declare readonly text: SimpleSignal<
      string[],
      this
  >;

  @computed()
  public graphNodes(): GraphNode[] {
    return this.children().filter(this.isGraphNode);
  }

  public get GraphNodes() {
    return this.children().filter(this.isGraphNode);
  }

  public connectionRefs: GraphConnection[] = [];

  public constructor(props?: GraphProps) {
    super(props);
    /*
    if(this.connections() != null){
      this.connections().map((lineValues) => {
        for (let i = 0; i < lineValues.length - 1; i++) {
          this.add(
            <Line
              ref={makeRef(this.connectionRefs, this.connectionRefs.length)}
              points={[
                this.graphNodes()[lineValues[i]].position(),
                this.graphNodes()[lineValues[i + 1]].position(),
              ]}
              lineWidth={10}
              stroke={"242424"}
            />
          );
          this.connectionRefs[this.connectionRefs.length - 1].moveToBottom();
        }
      });
    }
    */

    if (this.connections() != null) {
      this.connections().map((lineValues) => {
        for (let i = 0; i < lineValues.length - 1; i++) {
          this.add(
            <GraphConnection
              startNode={this.graphNodes()[lineValues[i]]}
              endNode={this.graphNodes()[lineValues[i + 1]]}
              ref={makeRef(this.connectionRefs, this.connectionRefs.length)}
              // text={this.text()[i]}
            />
          );
          this.connectionRefs[this.connectionRefs.length - 1].moveToBottom();
        }
      });
    }

    if (this.showIndex()) {
      range(0, this.graphNodes().length).map((i) =>
        this.add(
          <Txt
            text={i.toString()}
            position={this.graphNodes()[i].position()}
            fontSize={20}
            fontFamily={"Inter"}
            fill={"D6D6D6"}
          />
        )
      );
      range(0, this.connectionRefs.length).map((i) =>
        this.add(
          <Txt
            text={i.toString()}
            position={this.connectionRefs[i].getPointAtPercentage(0.5).position}
            stroke={"0f0f0f"}
            lineWidth={20}
            strokeFirst
            fontSize={40}
            fontFamily={"Inter"}
            fill={"D6D6D6"}
          />
        )
      );
    }

    if (this.fadeInStartNode() != null){
      this.connectionRefs.map(connection => connection.opacity(0))
      this.graphNodes().map(node => node.scale(0))
    }
  }

  public *Traverse(
    connectionIndex: number,
    Direction: boolean = true,
    Duration: number = 1
  ) {
    const value = createSignal(0);
    this.connectionRefs[connectionIndex].stroke(
      new Gradient({
        type: "linear",
        from: Direction
          ? this.connectionRefs[connectionIndex].points()[0]
          : this.connectionRefs[connectionIndex].points()[1],
        to: Direction
          ? this.connectionRefs[connectionIndex].points()[1]
          : this.connectionRefs[connectionIndex].points()[0],
        stops: [
          {
            offset: () => (value() - 0.2 < 0 ? 0 : value() - 0.2),
            color: "#242424",
          },
          { offset: value, color: Colors.blue },
          {
            offset: () => (value() + 0.2 > 1 ? 1 : value() + 0.2),
            color: "#242424",
          },
        ],
      })
    );
    yield* value(1, Duration);
    yield* this.connectionRefs[connectionIndex].stroke("#242424");
  }

  public *highlightConnection(
    connectionIndex: number,
    color: PossibleColor,
    duration: number
  ) {
    yield* this.connectionRefs[connectionIndex].stroke(color, duration);
  }

  public* fadeIn(){
    yield* this.fadeHelper(this.graphNodes()[this.fadeInStartNode()]);
  }

  private* fadeHelper(Node: GraphNode): any{
    yield* Node.fadeIn();

    const startConnections = this.connectionRefs.filter(connection => {
      return connection.startNode() == Node; 
    })

    for(let connection of startConnections){
      yield connection.fadeIn(true);
      yield* waitFor(.5);
      yield this.fadeHelper(connection.endNode());
    }
    yield* waitFor(startConnections.length*2.5)
  }
  
  private isGraphNode(node: GraphNode): node is GraphNode {
    return node instanceof GraphNode;
  }
}
