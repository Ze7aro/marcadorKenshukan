import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    Checkbox,
    Slider,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useConfig } from "@/context/ConfigContext";

interface ConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ConfigModal = ({ isOpen, onClose }: ConfigModalProps) => {
    const { config, updateConfig, resetConfig } = useConfig();

    // Local state to manage inputs before saving?
    // Or direct update? Direct update is instant, maybe better for "Settings" feel.
    // But usually modals have "Save" or "Close".
    // Let's use direct update for simplicity as per requirements (Config Context updates immediately).

    // However, Slider sometimes needs intermediate state.

    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Configuración
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex flex-col gap-6">
                                {/* Kumite Settings */}
                                <div className="flex flex-col gap-2">
                                    <h3 className="text-lg font-bold">Kumite</h3>

                                    <div className="flex flex-col gap-2">
                                        <span className="text-sm">
                                            Umbral de Victoria (Puntos)
                                        </span>
                                        <div className="flex items-center gap-4">
                                            <Input
                                                className="w-20"
                                                label=""
                                                type="number"
                                                value={config.kumite.winThreshold.toString()}
                                                onChange={(e) =>
                                                    updateConfig("kumite", {
                                                        winThreshold: parseInt(e.target.value) || 0,
                                                    })
                                                }
                                            />
                                            <span className="text-xs text-gray-500">
                                                Puntos de diferencia o totales para ganar
                                                automáticamente (Ippon=1, Wazari=0.5). Default WKF: 8.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 mt-2">
                                        <Checkbox
                                            isSelected={config.kumite.autoWinnerOnPenalty}
                                            onValueChange={(isSelected) =>
                                                updateConfig("kumite", {
                                                    autoWinnerOnPenalty: isSelected,
                                                })
                                            }
                                        >
                                            Auto-Ganador por Penalización (Hansoku/Kiken)
                                        </Checkbox>
                                        <p className="text-xs text-gray-500 ml-7">
                                            Si se marca Hansoku, Shikaku o Kiken, el oponente gana
                                            automáticamente.
                                        </p>
                                    </div>
                                </div>

                                {/* General Settings */}
                                {/* Add more later */}

                                <div className="border-t pt-4">
                                    <Button color="danger" variant="light" onPress={resetConfig}>
                                        Restaurar Valores por Defecto
                                    </Button>
                                </div>
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onPress={onClose}>
                                Cerrar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
