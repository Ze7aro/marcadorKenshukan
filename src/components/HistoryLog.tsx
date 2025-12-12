import React, { useEffect, useRef } from "react";
import { ScrollShadow } from "@heroui/react";

import { useKumite } from "@/context/KumiteContext";

export const HistoryLog: React.FC = () => {
    const { state } = useKumite();
    const { history } = state;
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    if (history.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm italic p-4 border-2 border-dashed border-gray-300 rounded-lg">
                No hay acciones registradas
            </div>
        );
    }

    return (
        <ScrollShadow
            ref={scrollRef}
            className="w-full h-full max-h-[300px] overflow-y-auto p-2 bg-white/50 dark:bg-black/50 rounded-lg backdrop-blur-sm"
        >
            <div className="flex flex-col gap-1">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className={`flex justify-between items-center text-xs sm:text-sm p-2 rounded ${item.competitor === "aka"
                                ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-l-4 border-red-500"
                                : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-l-4 border-blue-500"
                            }`}
                    >
                        <span className="font-bold uppercase opacity-70 text-[10px] w-12">
                            {item.competitor}
                        </span>
                        <span className="flex-1 font-medium">{item.description}</span>
                        <span className="text-[10px] opacity-50 tabular-nums">
                            {new Date(item.timestamp).toLocaleTimeString([], {
                                hour12: false,
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </span>
                    </div>
                ))}
            </div>
        </ScrollShadow>
    );
};
