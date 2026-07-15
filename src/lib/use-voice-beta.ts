"use client";

import { useEffect, useState } from "react";

const VOICE_BETA_STORAGE_KEY = "voiceBetaEnabled";

function readStoredVoiceBeta() {
  try {
    return window.localStorage.getItem(VOICE_BETA_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function persistVoiceBeta(isEnabled: boolean) {
  try {
    window.localStorage.setItem(
      VOICE_BETA_STORAGE_KEY,
      isEnabled ? "true" : "false"
    );
  } catch {
    // Ignore storage failures so beta gating never affects the production app.
  }
}

function removeVoiceBetaQueryParam(url: URL) {
  url.searchParams.delete("voiceBeta");

  const nextUrl = `${url.pathname}${url.search}${url.hash}`;
  try {
    window.history.replaceState(window.history.state, "", nextUrl);
  } catch {
    // Keeping the query string is safer than interrupting the normal app flow.
  }
}

export function useVoiceBeta() {
  const [isVoiceBetaEnabled, setIsVoiceBetaEnabled] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const queryValue = url.searchParams.get("voiceBeta");

    if (queryValue === "1" || queryValue === "0") {
      const nextValue = queryValue === "1";

      persistVoiceBeta(nextValue);
      setIsVoiceBetaEnabled(nextValue);
      removeVoiceBetaQueryParam(url);
      return;
    }

    setIsVoiceBetaEnabled(readStoredVoiceBeta());
  }, []);

  return isVoiceBetaEnabled;
}

export function useVoiceDebug() {
  const [isVoiceDebugEnabled, setIsVoiceDebugEnabled] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);

    setIsVoiceDebugEnabled(url.searchParams.get("voiceDebug") === "1");
  }, []);

  return isVoiceDebugEnabled;
}
