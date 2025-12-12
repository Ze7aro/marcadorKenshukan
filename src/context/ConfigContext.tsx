import React, { createContext, useContext, ReactNode, useEffect } from "react";
import { useLocalStorage } from "@/hooks/useLocalStorage";

// Definición de tipos para la configuración
export interface AppConfig {
    kumite: {
        winThreshold: number; // Puntos para ganar por diferencia (default 8 o 6)
        matchDuration: number; // Duración en segundos (default 180)
        autoWinnerOnPenalty: boolean; // Si Hansoku/Kiken otorga victoria automática
    };
    kata: {
        defaultJudges: number; // Default número de jueces (3 o 5)
        scoreRange: {
            min: number;
            max: number;
        };
    };
}

const defaultConfig: AppConfig = {
    kumite: {
        winThreshold: 6, // Updated to user preference
        matchDuration: 180,
        autoWinnerOnPenalty: true,
    },
    kata: {
        defaultJudges: 5,
        scoreRange: {
            min: 5.0,
            max: 9.0,
        },
    },
};

interface ConfigContextType {
    config: AppConfig;
    updateConfig: (category: keyof AppConfig, updates: Partial<AppConfig["kumite"] | AppConfig["kata"]>) => void;
    resetConfig: () => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
    const [config, setConfig] = useLocalStorage<AppConfig>("kenshukanConfig", defaultConfig);

    // Ensure deep merge on init in case structure changes in updates, 
    // but simple localStorage hook might just replace. 
    // For now simple replace is fine as structure is small.

    const updateConfig = (
        category: keyof AppConfig,
        updates: Partial<AppConfig["kumite"] | AppConfig["kata"]>
    ) => {
        setConfig((prev) => ({
            ...prev,
            [category]: {
                ...prev[category],
                ...updates
            }
        }));
    };

    const resetConfig = () => {
        setConfig(defaultConfig);
    };

    return (
        <ConfigContext.Provider value={{ config, updateConfig, resetConfig }}>
            {children}
        </ConfigContext.Provider>
    );
};

export const useConfig = () => {
    const context = useContext(ConfigContext);
    if (!context) {
        throw new Error("useConfig must be used within a ConfigProvider");
    }
    return context;
};
