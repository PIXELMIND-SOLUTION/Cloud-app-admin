import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const SessionTimedOut = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef();

  useEffect(() => {
    const logout = () => {
      sessionStorage.clear();
      navigate("/", { replace: true });
    };

    const resetTimer = () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(logout, 900000); // 1 minute
    };

    ["mousemove", "keydown", "click", "scroll"].forEach((event) =>
      window.addEventListener(event, resetTimer)
    );

    resetTimer();

    return () => {
      clearTimeout(timeoutRef.current);

      ["mousemove", "keydown", "click", "scroll"].forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [navigate]);

  return null;
};

export default SessionTimedOut;