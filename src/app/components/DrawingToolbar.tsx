import React from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { DrawingToolbarLayout } from "./DrawingToolbar/DrawingToolbarLayout";
import type { DrawingToolbarProps } from "./DrawingToolbar/types";

export type { DrawingTool, DrawingToolbarProps } from "./DrawingToolbar/types";

export const DrawingToolbar = React.memo(function DrawingToolbar(props: DrawingToolbarProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return <DrawingToolbarLayout {...props} isRTL={isRTL} />;
});
