import { Circle, Line, Shape, ShapeProps} from "@motion-canvas/2d/lib/components";
import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SignalValue, SimpleSignal } from "@motion-canvas/core/lib/signals";
import { Color, PossibleVector2, Spacing, Vector2 } from "@motion-canvas/core/lib/types";
import { makeRef, useLogger } from "@motion-canvas/core/lib/utils";
import { HighLight } from "utils";

export interface GraphProps extends ShapeProps {
    nodes?: SignalValue<SignalValue<PossibleVector2>[]>
    connections?: SignalValue<number[][]>
    nodeSize?: SignalValue<number>
}

export class Graph extends Shape {
    @initial(null)
    @signal()
    public declare readonly nodes: SimpleSignal<
        SignalValue<PossibleVector2>[] | null,
        this
    >;

    @initial(null)
    @signal()
    public declare readonly connections: SimpleSignal<
        number[][],
        this
    >;

    @initial(64)
    @signal()
    public declare readonly nodeSize: SimpleSignal<
        number, 
        this
    >;

    private nodeRefs: Circle[] = [];
    private connectionRefs: Line[] = [];

    public constructor(props?: GraphProps) {
        super(props)
        this.connections().map(lineValues => {
            if(lineValues.length > 1){
                this.add(
                    <Line 
                        ref={makeRef(this.connectionRefs, this.connectionRefs.length)}
                        points={lineValues.map(pos => this.nodes()[pos])}
                        lineWidth={10}
                        stroke={"white"}
                    />
                )
            } 
        })

        this.nodes().map(pos => {
            this.add(
                <Circle 
                    ref={makeRef(this.nodeRefs, this.nodeRefs.length)}
                    size={this.nodeSize}
                    fill={"white"}
                    position={pos}
                />
            )
        })

    }

    public* highlightNode(nodeIndex: number, color: Color, duration: number){
        yield* this.nodeRefs[nodeIndex].fill(color, duration)
    }

    public* highlightConnection(connectionIndex: number, color: Color, duration: number){
        yield* this.connectionRefs[connectionIndex].stroke(color, duration)
    }
}
