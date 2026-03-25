'use client';
import React, { useEffect, useState, useMemo } from 'react';

export interface TradeErrorInfo {
  title?: string;
  message: string;
  symbol?: string;
  action?: string;
  details?: string[];
}

interface TradeErrorPopupProps {
  error: TradeErrorInfo | null;
  onClose: () => void;
}

export function TradeErrorPopup({ error, onClose }: TradeErrorPopupProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (error) {
      setIsLeaving(false);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
    }
  }, [error]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      setIsLeaving(false);
      onClose();
    }, 350);
  };

  // Deduplicate details — group identical errors with count
  const dedupedDetails = useMemo(() => {
    if (!error?.details || error.details.length === 0) return [];
    const countMap = new Map<string, number>();
    for (const d of error.details) {
      countMap.set(d, (countMap.get(d) || 0) + 1);
    }
    return Array.from(countMap.entries()); // [message, count][]
  }, [error?.details]);

  // Build a short display message (first unique error only)
  const displayMessage = useMemo(() => {
    if (!error) return '';
    // If message contains newlines (bulk errors joined), show only the first unique
    const lines = error.message.split('\n').filter(Boolean);
    const uniqueLines = [...new Set(lines)];
    return uniqueLines[0] || error.message;
  }, [error]);

  const totalErrorCount = error?.details?.length || 0;

  if (!error) return null;

  const errorTitle = error.title || getErrorTitle(error.message);
  const errorIcon = getErrorIcon(error.message);
  const errorColor = getErrorColor(error.message);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99998,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          opacity: isVisible && !isLeaving ? 1 : 0,
          transition: 'opacity 0.35s ease',
          pointerEvents: isVisible && !isLeaving ? 'auto' : 'none',
        }}
      />

      {/* Popup */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: isVisible && !isLeaving
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -50%) scale(0.85)',
          zIndex: 99999,
          width: 'min(440px, 92vw)',
          maxHeight: 'min(420px, 80vh)',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '20px',
          background: 'linear-gradient(145deg, rgba(30,10,10,0.96), rgba(20,5,5,0.98))',
          border: `1px solid ${errorColor}44`,
          boxShadow: `
            0 0 60px ${errorColor}20,
            0 25px 50px rgba(0,0,0,0.6),
            inset 0 1px 0 rgba(255,255,255,0.06)
          `,
          opacity: isVisible && !isLeaving ? 1 : 0,
          transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
          overflow: 'hidden',
          pointerEvents: isVisible && !isLeaving ? 'auto' : 'none',
        }}
      >
        {/* Glow bar at top */}
        <div style={{
          height: '3px',
          flexShrink: 0,
          background: `linear-gradient(90deg, transparent, ${errorColor}, transparent)`,
          animation: 'tradeErrorGlow 2s ease-in-out infinite',
        }} />

        {/* Content — scrollable */}
        <div style={{ padding: '24px 24px 20px', overflowY: 'auto', flex: 1, minHeight: 0 }}>
          {/* Icon + Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: `${errorColor}15`,
              border: `1px solid ${errorColor}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
              animation: 'tradeErrorPulse 2s ease-in-out infinite',
            }}>
              {errorIcon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 700,
                color: errorColor,
                letterSpacing: '-0.3px',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                {errorTitle}
                {totalErrorCount > 1 && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '8px',
                    background: `${errorColor}20`,
                    border: `1px solid ${errorColor}30`,
                    color: errorColor,
                  }}>
                    ×{totalErrorCount}
                  </span>
                )}
              </div>
              {error.symbol && (
                <div style={{
                  fontSize: '13px',
                  color: 'rgba(255,255,255,0.45)',
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}>
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.07)',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                  }}>
                    {error.symbol}
                  </span>
                  {error.action && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '6px',
                      background: error.action.toUpperCase().includes('BUY')
                        ? 'rgba(0,200,120,0.12)' : 'rgba(255,60,60,0.12)',
                      color: error.action.toUpperCase().includes('BUY')
                        ? '#00c878' : '#ff4444',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}>
                      {error.action}
                    </span>
                  )}
                </div>
              )}
            </div>
            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
              }}
            >
              ✕
            </button>
          </div>

          {/* Error Message — only first unique error */}
          <div style={{
            padding: '14px',
            borderRadius: '12px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            fontSize: '13px',
            color: 'rgba(255,255,255,0.75)',
            lineHeight: 1.6,
            direction: isArabic(displayMessage) ? 'rtl' : 'ltr',
            wordBreak: 'break-word',
          }}>
            {displayMessage}
          </div>

          {/* Deduplicated details list */}
          {dedupedDetails.length > 0 && (
            <div style={{
              marginTop: '10px',
              padding: '10px 14px',
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.04)',
              maxHeight: '140px',
              overflowY: 'auto',
            }}>
              {dedupedDetails.map(([detail, count], i) => (
                <div key={i} style={{
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.5)',
                  padding: '4px 0',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '8px',
                  borderBottom: i < dedupedDetails.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none',
                }}>
                  <span style={{ color: errorColor, fontSize: '8px', marginTop: '4px', flexShrink: 0 }}>●</span>
                  <span style={{ flex: 1, wordBreak: 'break-word', lineHeight: 1.5 }}>{detail}</span>
                  {count > 1 && (
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.06)',
                      color: 'rgba(255,255,255,0.4)',
                      flexShrink: 0,
                    }}>
                      ×{count}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes tradeErrorGlow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes tradeErrorPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}

function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}

function getErrorTitle(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('trade is disabled')) return '⛔ Trading Disabled';
  if (m.includes('not enough money') || m.includes('insufficient')) return '💰 Insufficient Funds';
  if (m.includes('invalid volume') || m.includes('volume')) return '📊 Invalid Volume';
  if (m.includes('market closed') || m.includes('market is closed')) return '🕐 Market Closed';
  if (m.includes('invalid price')) return '💹 Invalid Price';
  if (m.includes('off quotes')) return '📶 Off Quotes';
  if (m.includes('timeout') || m.includes('timed out')) return '⏱️ Connection Timeout';
  if (m.includes('session expired')) return '🔑 Session Expired';
  if (m.includes('not connected')) return '🔌 Not Connected';
  if (m.includes('invalid stops') || m.includes('invalid sl') || m.includes('invalid tp')) return '🎯 Invalid Stop/Target';
  if (m.includes('too many')) return '⚠️ Rate Limit';
  if (m.includes('invalid symbol') || m.includes('symbol does not exist')) return '❌ Invalid Symbol';
  return '❌ Trade Rejected';
}

function getErrorIcon(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('trade is disabled')) return '🚫';
  if (m.includes('not enough money') || m.includes('insufficient')) return '💸';
  if (m.includes('invalid volume')) return '📉';
  if (m.includes('market closed')) return '🔒';
  if (m.includes('timeout')) return '⏳';
  if (m.includes('session expired')) return '🔐';
  if (m.includes('not connected')) return '📡';
  if (m.includes('invalid symbol') || m.includes('symbol does not exist')) return '🔍';
  return '⚠️';
}

function getErrorColor(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('trade is disabled') || m.includes('market closed')) return '#ff4466';
  if (m.includes('not enough money') || m.includes('insufficient')) return '#ffaa33';
  if (m.includes('timeout') || m.includes('session')) return '#ff8844';
  if (m.includes('invalid symbol') || m.includes('symbol does not exist')) return '#ff6688';
  return '#ff5555';
}

export default TradeErrorPopup;
