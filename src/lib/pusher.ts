import PusherServer from "pusher";
import PusherClient from "pusher-js";

const appId = process.env.NEXT_PUBLIC_PUSHER_APP_ID;
const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
const secret = process.env.PUSHER_SECRET;
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

// Defensive check to avoid server-side or compile-time crashes if keys are unconfigured
export const pusherServer = (appId && key && secret && appId !== "your-pusher-id" && key !== "your-pusher-key" && secret !== "your-pusher-secret")
  ? new PusherServer({
      appId,
      key,
      secret,
      cluster: cluster || "mt1",
      useTLS: true,
    })
  : null;

// Defensive check to avoid browser-side hydration crashes if key is unconfigured or a placeholder
export const pusherClient = (typeof window !== "undefined" && key && key !== "your-pusher-key")
  ? new ((PusherClient as unknown as { default?: typeof PusherClient }).default || PusherClient)(
      key,
      {
        cluster: cluster || "mt1",
      }
    )
  : null;
