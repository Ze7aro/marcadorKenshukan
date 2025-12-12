import { useEffect, useCallback, useRef } from "react";

/**
 * Hook personalizado para manejar BroadcastChannel API
 * Permite comunicación entre pestañas/ventanas del navegador
 * @param channelName - Nombre del canal de broadcast
 * @param onMessage - Callback que se ejecuta cuando se recibe un mensaje
 * @returns postMessage - Función para enviar mensajes al canal
 */
export function useBroadcastChannel<T = any>(
  channelName: string,
  onMessage?: (data: T) => void,
): (data: T) => void {
  const channelRef = useRef<BroadcastChannel | null>(null);
  const onMessageRef = useRef(onMessage);

  // Actualizar la referencia del callback
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  // Inicializar el canal
  useEffect(() => {
    // Verificar soporte de BroadcastChannel
    if (typeof BroadcastChannel === "undefined") {
      console.warn("BroadcastChannel API no está soportada en este navegador");

      return;
    }

    try {
      channelRef.current = new BroadcastChannel(channelName);

      // Configurar listener para mensajes entrantes
      if (onMessageRef.current) {
        channelRef.current.onmessage = (event: MessageEvent<T>) => {
          onMessageRef.current?.(event.data);
        };
      }

      // Manejar errores del canal
      channelRef.current.onmessageerror = (event) => {
        console.error("Error en BroadcastChannel:", event);
      };
    } catch (error) {
      console.error(`Error creando BroadcastChannel "${channelName}":`, error);
    }

    // Cleanup: cerrar el canal cuando el componente se desmonte
    return () => {
      if (channelRef.current) {
        channelRef.current.close();
        channelRef.current = null;
      }
    };
  }, [channelName]);

  // Función para enviar mensajes
  const postMessage = useCallback(
    (data: T) => {
      if (channelRef.current) {
        try {
          channelRef.current.postMessage(data);
        } catch (error) {
          console.error(
            `Error enviando mensaje al canal "${channelName}":`,
            error,
          );
        }
      } else {
        console.warn(`BroadcastChannel "${channelName}" no está inicializado`);
      }
    },
    [channelName],
  );

  return postMessage;
}
