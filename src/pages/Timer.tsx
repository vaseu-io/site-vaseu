import { useState, useEffect } from "react";
import birdLogo from "@/assets/bird-logo.png";
import CountdownTimer from "@/components/CountdownTimer";

const Timer = () => {
    const [inverted, setInverted] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setInverted((prev) => !prev);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className="relative flex min-h-screen overflow-hidden transition-colors duration-700"
            style={{
                backgroundColor: inverted ? "#0d0d0d" : "#ffffff",
                color: inverted ? "#fafafa" : "#0d0d0d",
            }}
        >
            {/* 06.MAR - Top Left */}
            <span className="absolute top-8 left-8 font-display text-sm md:text-base font-light tracking-[0.15em] select-none">
                06.MAR
            </span>

            {/* Countdown + Bird - Centered */}
            <div className="flex flex-col items-center justify-center w-full">
                <CountdownTimer />
                <img
                    src={birdLogo}
                    alt="Logo"
                    className="h-[3.5rem] md:h-[4.5rem] w-auto mt-6 transition-all duration-700"
                    style={{ filter: inverted ? "invert(1)" : "none" }}
                />
            </div>

            {/* LINHA — BASIC - Bottom Right */}
            <span className="absolute bottom-8 right-8 font-display text-sm md:text-base font-light tracking-[0.3em] uppercase whitespace-nowrap select-none">
                Linha — Basic
            </span>
        </div>
    );
};

export default Timer;
