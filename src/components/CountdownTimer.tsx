import { useState, useEffect } from "react";

const TARGET_DATE = new Date("2026-03-06T13:00:00Z"); // 06/03/2026 às 10:00 BRT

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const getTimeLeft = (): TimeLeft => {
    const now = new Date();
    const diff = Math.max(0, TARGET_DATE.getTime() - now.getTime());
    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
};

const pad = (n: number) => String(n).padStart(2, "0");

const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(getTimeLeft());

    useEffect(() => {
        const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="font-display tracking-[0.25em] text-2xl md:text-4xl font-light select-none">
            <span className="tabular-nums">
                {pad(timeLeft.days)} · {pad(timeLeft.hours)} · {pad(timeLeft.minutes)} · {pad(timeLeft.seconds)}
            </span>
        </div>
    );
};

export default CountdownTimer;
