/*
 * @Author: 1009
 * @Date: 2025-05-13 17:30:41
 * @LastEditors: 1009
 * @LastEditTime: 2025-05-14 16:28:41
 * @Description: OnBoarding组件
 */
import React, { FC, useState, useEffect } from "react";
import { Mask } from "./Mask";
import { Button, Popover } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
import { createPortal } from "react-dom";

export interface OnBoardingStepConfig {
  selector: string;
  placement?: TooltipPlacement;
  renderContent: () => React.ReactNode;
}
export interface OnBoardingProps {
  step?: number;
  steps: OnBoardingStepConfig[];
  getContainer?: () => HTMLElement;
  onStepsEnd?: () => void;
}

export const OnBoarding: FC<OnBoardingProps> = (props) => {
  const { steps, step = 0, getContainer, onStepsEnd } = props;
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const currentSelectedElement = document.getElementById(
    steps[currentStep]?.selector
  );
  const currentContainerElement = getContainer?.() || document.documentElement;
  const [done, setDone] = useState(false);
  const [isMaskReady, setIsMaskReady] = useState(false);
  const getCurrentStep = () => {
    return steps[currentStep];
  };
  const back = async () => {
    if (currentStep === 0) {
      return;
    }

    setCurrentStep(currentStep - 1);
  };
  const forward = async () => {
    if (currentStep === steps.length - 1) {
      await onStepsEnd?.();
      setDone(true);
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  useEffect(() => {
    setCurrentStep(step!);
  }, [step]);

  if (!currentSelectedElement || done) {
    return null;
  }

  const renderPopover = (wrapper: React.ReactNode) => {
    const config = getCurrentStep();

    if (!config) {
      return wrapper;
    }

    const { renderContent } = config;
    const content = renderContent ? renderContent() : null;

    const operation = (
      <div className={"onboarding-operation"}>
        {currentStep !== 0 && (
          <Button className={"back"} onClick={() => back()}>
            {"上一步"}
          </Button>
        )}
        <Button
          className={"forward"}
          type={"primary"}
          onClick={() => forward()}
        >
          {currentStep === steps.length - 1 ? "我知道了" : "下一步"}
        </Button>
      </div>
    );

    return isMaskReady ? (
      <Popover
        content={
          <div>
            {content}
            {operation}
          </div>
        }
        open={true}
        placement={getCurrentStep()?.placement}
      >
        {wrapper}
      </Popover>
    ) : (
      wrapper
    );
  };

  const mask = (
    <Mask
      container={currentContainerElement}
      element={currentSelectedElement}
      renderMaskContent={(wrapper) => renderPopover(wrapper)}
      onAnimationEnd={() => {
        setIsMaskReady(true);
      }}
      onAnimationStart={() => setIsMaskReady(false)}
    />
  );
  return createPortal(mask, currentContainerElement);
};
