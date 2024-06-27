"use client";

import { useEffect, useState } from "react";

interface CountdownProps {
  seconds: number;
  isLoading: boolean;
}

export const Countdown = ({
  seconds: initialSeconds,
  isLoading,
}: CountdownProps) => {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s <= 0) {
          clearInterval(timer);
          return 0; // Stop at 0 to prevent negative values
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = Math.max(Math.floor(seconds / 86400), 0); // Ensure non-negative
  const hours = Math.max(Math.floor((seconds % 86400) / 3600), 0);
  const minutes = Math.max(Math.floor((seconds % 3600) / 60), 0);
  const displaySeconds = Math.max(seconds % 60, 0);

  return (
    <div className="flex gap-4 justify-between text-white p-4">
      {isLoading ? (
        <div className="flex items-center justify-center">
          <span className="loading loading-bars loading-lg"></span>
        </div>
      ) : (
        <div>
          <div>Time until finalized epoch</div>
          {days > 0 && <div>{days} days</div>}
          {hours}:{minutes < 10 ? "0" + minutes : minutes}:
          {displaySeconds < 10 ? "0" + displaySeconds : displaySeconds}
        </div>
      )}
    </div>
  );
};
