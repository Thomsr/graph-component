import { Layout, LayoutProps, Node, Rect, ShapeProps, Txt } from "@motion-canvas/2d/lib/components";
import { easeInOutCubic, linear, tween } from "@motion-canvas/core/lib/tweening"
import { Color } from "@motion-canvas/core/lib/types/Color"
import { initial, signal } from "@motion-canvas/2d/lib/decorators";
import { SignalValue, SimpleSignal } from "@motion-canvas/core/lib/signals";
import { Spacing, Vector2 } from "@motion-canvas/core/lib/types";
import { makeRef } from "@motion-canvas/core/lib/utils";
import { range } from '@motion-canvas/core/lib/utils';
import { all } from "@motion-canvas/core/lib/flow"

export interface ArrayProps extends ShapeProps, LayoutProps {
    values?: SignalValue<number[] | string[] >;
    boxWidth?: SignalValue<number>;
    boxHeight?: SignalValue<number>;
    boxGap?: SignalValue<number>;
}

export class Array extends Layout {
     
}
