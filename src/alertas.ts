import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export async function pedirPermissao(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return true;
  try {
    const r = await LocalNotifications.requestPermissions();
    return r.display === "granted";
  } catch {
    return false;
  }
}

export async function notificar(titulo: string, corpo: string) {
  if (!Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.schedule({
      notifications: [
        { id: Math.floor(Math.random() * 1_000_000), title: titulo, body: corpo, schedule: { at: new Date(Date.now() + 500) } }
      ]
    });
  } catch {
    /* notificação indisponível */
  }
}
