import type { Block, PhaseStateId } from "../types";

export const STATE_CONFIG: Record<
  PhaseStateId,
  { containerClassName: "space-y-4" | "space-y-5"; blocks: Block[] }
> = {
  phase: {
    containerClassName: "space-y-5",
    blocks: [
      { type: "title", level: 4, textKey: "statePhaseReadMoreTitle" },
      { type: "text", textKey: "statePhaseReadMoreIntro" },
      { type: "textBoldGray", textKey: "statePhaseReadMoreNotBuying" },
      { type: "textBoldGray", textKey: "statePhaseReadMoreNotSelling" },
      { type: "textBoldColor", textKey: "statePhaseReadMoreTransitioning" },
      { type: "text", textKey: "statePhaseReadMoreTraditional" },
      { type: "textBoldColor", textKey: "statePhaseReadMoreChallenge" },
      { type: "divider" },

      { type: "title", level: 5, textKey: "statePhaseReadMoreS2Title" },
      { type: "text", textKey: "statePhaseReadMoreS2Intro" },
      { type: "italicQuote", textKey: "statePhaseReadMoreS2Sub" },
      {
        type: "bullets",
        keys: [
          "statePhaseReadMoreS2Bullet1",
          "statePhaseReadMoreS2Bullet2",
          "statePhaseReadMoreS2Bullet3",
        ],
      },
      { type: "text", textKey: "statePhaseReadMoreS2Closing" },
      { type: "divider" },

      { type: "title", level: 5, textKey: "statePhaseReadMoreS3Title" },
      { type: "text", textKey: "statePhaseReadMoreS3P1" },
      { type: "textBoldColor", textKey: "statePhaseReadMoreS3Question" },
      { type: "textGray", tone: 400, textKey: "statePhaseReadMoreS3Helps" },
      {
        type: "bullets",
        keys: [
          "statePhaseReadMoreS3Bullet1",
          "statePhaseReadMoreS3Bullet2",
          "statePhaseReadMoreS3Bullet3",
        ],
        indentLeft: true,
      },
      { type: "text", textKey: "statePhaseReadMoreS3Closing" },
      { type: "divider" },

      { type: "title", level: 5, textKey: "statePhaseReadMoreS4Title" },
      { type: "text", textKey: "statePhaseReadMoreS4P1" },
      { type: "text", textKey: "statePhaseReadMoreS4P2" },
      { type: "text", textKey: "statePhaseReadMoreS4P3" },
      { type: "textBoldColor", textKey: "statePhaseReadMoreS4P4" },
      { type: "divider" },

      { type: "title", level: 5, textKey: "statePhaseReadMoreS5Title" },
      { type: "text", textKey: "statePhaseReadMoreS5P1" },
      { type: "textGray", tone: 300, textKey: "statePhaseReadMoreS5P2" },
      { type: "textGray", tone: 300, textKey: "statePhaseReadMoreS5P3" },
      { type: "text", textKey: "statePhaseReadMoreS5P4" },
      { type: "divider" },
      { type: "tagline", textKey: "statePhaseReadMoreTagline" },
    ],
  },

  displacement: {
    containerClassName: "space-y-4",
    blocks: [
      { type: "title", level: 4, textKey: "stateDisplacementReadMoreTitle" },
      { type: "italicQuote", textKey: "stateDisplacementReadMoreP1" },
      { type: "text", textKey: "stateDisplacementReadMoreP2" },
      { type: "text", textKey: "stateDisplacementReadMoreP3" },
      { type: "textBoldColor", textKey: "stateDisplacementReadMoreP4" },
      { type: "divider" },
      { type: "tagline", textKey: "stateDisplacementReadMoreP5" },
    ],
  },

  reference: {
    containerClassName: "space-y-4",
    blocks: [
      { type: "title", level: 4, textKey: "stateReferenceReadMoreTitle" },
      { type: "italicQuote", textKey: "stateReferenceReadMoreP1" },
      { type: "text", textKey: "stateReferenceReadMoreP2" },
      { type: "text", textKey: "stateReferenceReadMoreP3" },
      { type: "divider" },
      { type: "tagline", textKey: "stateReferenceReadMoreP4" },
    ],
  },

  oscillation: {
    containerClassName: "space-y-4",
    blocks: [
      { type: "title", level: 4, textKey: "stateOscillationReadMoreTitle" },
      { type: "italicQuote", textKey: "stateOscillationReadMoreP1" },
      { type: "text", textKey: "stateOscillationReadMoreP2" },
      { type: "text", textKey: "stateOscillationReadMoreP3" },
      { type: "textBoldColor", textKey: "stateOscillationReadMoreP4" },
      { type: "divider" },
      { type: "textGray", tone: 400, textKey: "stateOscillationReadMoreP5" },
      {
        type: "bullets",
        keys: [
          "stateOscillationReadMoreBullet1",
          "stateOscillationReadMoreBullet2",
          "stateOscillationReadMoreBullet3",
          "stateOscillationReadMoreBullet4",
        ],
        variant: "medium",
      },
      { type: "textBoldColor", textKey: "stateOscillationReadMoreP6" },
      { type: "divider" },
      { type: "text", textKey: "stateOscillationReadMoreP7" },
      {
        type: "bullets",
        keys: [
          "stateOscillationReadMoreBullet5",
          "stateOscillationReadMoreBullet6",
          "stateOscillationReadMoreBullet7",
          "stateOscillationReadMoreBullet8",
        ],
        indentLeft: true,
      },
      { type: "divider" },
      { type: "text", textKey: "stateOscillationReadMoreP8" },
      { type: "text", textKey: "stateOscillationReadMoreP9" },
      { type: "textBoldColor", textKey: "stateOscillationReadMoreP10" },
      { type: "textGray", tone: 300, textKey: "stateOscillationReadMoreP11" },
      { type: "divider" },
      { type: "tagline", textKey: "stateOscillationReadMoreTagline" },
    ],
  },

  direction: {
    containerClassName: "space-y-4",
    blocks: [
      { type: "title", level: 4, textKey: "stateDirectionReadMoreTitle" },
      { type: "italicQuote", textKey: "stateDirectionReadMoreP1" },
      { type: "text", textKey: "stateDirectionReadMoreP2" },
      { type: "text", textKey: "stateDirectionReadMoreP3" },
      { type: "textBoldColor", textKey: "stateDirectionReadMoreP4" },
      { type: "divider" },
      { type: "text", textKey: "stateDirectionReadMoreP5" },
      { type: "textBoldColor", textKey: "stateDirectionReadMoreP6" },
      { type: "divider" },
      { type: "tagline", textKey: "stateDirectionReadMoreTagline" },
    ],
  },

  envelope: {
    containerClassName: "space-y-4",
    blocks: [
      { type: "title", level: 4, textKey: "stateEnvelopeReadMoreTitle" },
      { type: "italicQuote", textKey: "stateEnvelopeReadMoreP1" },
      { type: "text", textKey: "stateEnvelopeReadMoreP2" },
      { type: "text", textKey: "stateEnvelopeReadMoreP3" },
      { type: "textBoldColor", textKey: "stateEnvelopeReadMoreP4" },
      { type: "divider" },
      { type: "text", textKey: "stateEnvelopeReadMoreP5" },
      { type: "textBoldColor", textKey: "stateEnvelopeReadMoreP6" },
      { type: "divider" },
      { type: "tagline", textKey: "stateEnvelopeReadMoreTagline" },
    ],
  },
};

