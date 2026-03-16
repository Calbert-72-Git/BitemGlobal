import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useAutoLogout = () => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const minutes = parseInt(localStorage.getItem("bitem_auto_logout") || "10");
      if (minutes <= 0) return;
      timerRef.current = setTimeout(() => {
        supabase.auth.signOut();
        window.location.href = "/login";
      }, minutes * 60 * 1000);
    };

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach(e => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(e => window.removeEventListener(e, resetTimer));
    };
  }, []);
};
