import { useState, useEffect, useCallback } from "react";

/**
 * Hook personalizado para manejar localStorage con sincronización automática
 * @param key - Clave del localStorage
 * @param initialValue - Valor inicial si no existe en localStorage
 * @returns [value, setValue, removeValue] - Estado y funciones para manipularlo
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Estado para almacenar el valor
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);

      return initialValue;
    }
  });

  // Función para actualizar el valor
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Permitir que value sea una función para tener la misma API que useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);
        window.localStorage.setItem(key, JSON.stringify(valueToStore));

        // Disparar evento personalizado para sincronizar entre pestañas
        window.dispatchEvent(
          new CustomEvent("local-storage", {
            detail: { key, value: valueToStore },
          }),
        );
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  // Función para eliminar el valor
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);

      window.dispatchEvent(
        new CustomEvent("local-storage", {
          detail: { key, value: null },
        }),
      );
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Escuchar cambios en localStorage desde otras pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      if (e instanceof StorageEvent) {
        if (e.key === key && e.newValue) {
          try {
            setStoredValue(JSON.parse(e.newValue));
          } catch (error) {
            console.error(
              `Error parsing localStorage value for key "${key}":`,
              error,
            );
          }
        }
      } else if (e instanceof CustomEvent) {
        if (e.detail.key === key) {
          setStoredValue(e.detail.value ?? initialValue);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange as EventListener);
    window.addEventListener(
      "local-storage",
      handleStorageChange as EventListener,
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange as EventListener,
      );
      window.removeEventListener(
        "local-storage",
        handleStorageChange as EventListener,
      );
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}
