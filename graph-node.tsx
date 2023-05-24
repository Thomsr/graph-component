import { Circle, CircleProps, Line, Shape, ShapeProps, Txt} from "@motion-canvas/2d/lib/components";
import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { all } from "@motion-canvas/core/lib/flow";
import { SignalValue, SimpleSignal } from "@motion-canvas/core/lib/signals";
import { Color, PossibleColor, PossibleVector2, Spacing, Vector2 } from "@motion-canvas/core/lib/types";
import { createRef, makeRef, useLogger } from "@motion-canvas/core/lib/utils";

export interface GraphNodeProps extends CircleProps {
    text?: SignalValue<string>
}

export class GraphNode extends Circle {
    @initial('')
    @signal()
    public declare readonly text: SimpleSignal<
        string,
        this
    >;

    private nodeRef = createRef<Circle>();
    private txtRef = createRef<Txt>();
    public fadedIn: boolean = false;
    
    public constructor(props?: GraphNodeProps) {
        super({
            size: 60,
            stroke: '242424',
            lineWidth: 10,
            fill: '0f0f0f',
            ...props
        })
        this.add(
            <Txt 
                ref={this.txtRef}
                text={this.text}
                fontFamily={"Inter"}
                fontSize={40}
                y={-70}
                fill={'d6d6d6'}
            />
        )
    }

    public* highlight(Color: PossibleColor, Duration: number){
        yield* this.stroke(Color, Duration);
    }

    public* enlarge(Duration: number, Size: number = 128){
        yield* all(
            this.size(Size, Duration),
            this.txtRef().fontSize(77, Duration)
        )
    }

    public* fadeIn(){
        if(this.fadedIn){
            yield;
            return;
        }
        this.fadedIn = true;
        yield* this.scale(1, 1);
    }
}
