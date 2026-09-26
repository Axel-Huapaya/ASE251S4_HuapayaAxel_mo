import AsyncStorage from "@react-native-async-storage/async-storage";

/** Guarda un valor serializado como JSON. */
export async function saveJson<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

/** Lee un valor JSON; devuelve null si no existe o está dañado. */
export async function loadJson<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function removeKey(key: string): Promise<void> {
  await AsyncStorage.removeItem(key);
}
