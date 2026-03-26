export type PhaseStateExpandedContentProps = {
  stateId:
    | "phase"
    | "displacement"
    | "reference"
    | "oscillation"
    | "direction"
    | "envelope";
  isOpen: boolean;
  stateColor: string;
  t: (key: string) => string;
};

export type Block =
  | { type: "title"; level: 4 | 5; textKey: string }
  | { type: "text"; textKey: string }
  | { type: "textBoldGray"; textKey: string }
  | { type: "textBoldColor"; textKey: string }
  | { type: "textGray"; tone: 300 | 400; textKey: string }
  | { type: "italicQuote"; textKey: string }
  | {
      type: "bullets";
      keys: string[];
      variant?: "normal" | "medium";
      indentLeft?: boolean;
    }
  | { type: "divider" }
  | { type: "tagline"; textKey: string };

export type PhaseStateId = PhaseStateExpandedContentProps["stateId"];
