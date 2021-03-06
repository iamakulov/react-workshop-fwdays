import React from "react";
import _ from "lodash";

import ContainerComponent, {
  ContainerStyle,
} from "components/designSystems/appsmith/ContainerComponent";
import { WidgetType, WidgetTypes } from "constants/WidgetConstants";
import WidgetFactory from "utils/WidgetFactory";
import {
  GridDefaults,
  CONTAINER_GRID_PADDING,
  WIDGET_PADDING,
} from "constants/WidgetConstants";

import BaseWidget, { WidgetProps, WidgetState } from "./BaseWidget";
import * as Sentry from "@sentry/react";

class ContainerWidget extends BaseWidget<
  ContainerWidgetProps<WidgetProps>,
  WidgetState
> {
  constructor(props: ContainerWidgetProps<WidgetProps>) {
    super(props);
    this.renderChildWidget = this.renderChildWidget.bind(this);
  }

  static getPropertyPaneConfig() {
    return [
      {
        sectionName: "General",
        children: [
          {
            helpText: "Use a html color name, HEX, RGB or RGBA value",
            placeholderText: "#FFFFFF / Gray / rgb(255, 99, 71)",
            propertyName: "backgroundColor",
            label: "Background Color",
            controlType: "INPUT_TEXT",
            isBindProperty: true,
            isTriggerProperty: false,
          },
          {
            helpText: "Controls the visibility of the widget",
            propertyName: "isVisible",
            label: "Visible",
            controlType: "SWITCH",
            isJSConvertible: true,
            isBindProperty: true,
            isTriggerProperty: false,
          },
          {
            propertyName: "shouldScrollContents",
            label: "Scroll Contents",
            controlType: "SWITCH",
            isBindProperty: false,
            isTriggerProperty: false,
          },
        ],
      },
    ];
  }

  getSnapSpaces = () => {
    return {
      snapRowSpace: GridDefaults.DEFAULT_GRID_ROW_HEIGHT,
      snapColumnSpace: GridDefaults.DEFAULT_GRID_COLUMN_WIDTH,
    };
  };

  renderChildWidget(childWidgetData: WidgetProps): React.ReactNode {
    // For now, isVisible prop defines whether to render a detached widget
    if (childWidgetData.detachFromLayout && !childWidgetData.isVisible) {
      return null;
    }

    const snapSpaces = this.getSnapSpaces();
    const { componentWidth, componentHeight } = this.getComponentDimensions();

    if (childWidgetData.type !== WidgetTypes.CANVAS_WIDGET) {
      childWidgetData.parentColumnSpace = snapSpaces.snapColumnSpace;
      childWidgetData.parentRowSpace = snapSpaces.snapRowSpace;
    } else {
      // This is for the detached child like the default CANVAS_WIDGET child

      childWidgetData.rightColumn = componentWidth;
      childWidgetData.bottomRow = this.props.shouldScrollContents
        ? childWidgetData.bottomRow
        : componentHeight;
      childWidgetData.minHeight = componentHeight;
      childWidgetData.isVisible = this.props.isVisible;
      childWidgetData.shouldScrollContents = false;
      childWidgetData.canExtend = this.props.shouldScrollContents;
    }

    childWidgetData.parentId = this.props.widgetId;

    return WidgetFactory.createWidget(childWidgetData, this.props.renderMode);
  }

  renderChildren = () => {
    return _.map(
      // sort by row so stacking context is correct
      // TODO(abhinav): This is hacky. The stacking context should increase for widgets rendered top to bottom, always.
      // Figure out a way in which the stacking context is consistent.
      _.sortBy(_.compact(this.props.children), (child) => child.topRow),
      this.renderChildWidget,
    );
  };

  renderAsContainerComponent(props: ContainerWidgetProps<WidgetProps>) {
    return (
      <ContainerComponent {...props}>
        {this.renderChildren()}
      </ContainerComponent>
    );
  }

  getPageView() {
    return this.renderAsContainerComponent(this.props);
  }

  getWidgetType(): WidgetType {
    return WidgetTypes.CONTAINER_WIDGET;
  }
}

export interface ContainerWidgetProps<T extends WidgetProps>
  extends WidgetProps {
  children?: T[];
  containerStyle?: ContainerStyle;
  shouldScrollContents?: boolean;
}

export default ContainerWidget;
export const ProfiledContainerWidget = Sentry.withProfiler(ContainerWidget);
