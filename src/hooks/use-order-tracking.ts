import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

export const useOrderTracking = (orderId: string) => {
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!orderId || !pusherClient) return;

    const channel = pusherClient.subscribe(`order-${orderId}`);

    channel.bind("status-update", (data: { status: string }) => {
      setStatus(data.status);
    });

    return () => {
      if (pusherClient) {
        pusherClient.unsubscribe(`order-${orderId}`);
      }
    };
  }, [orderId]);

  return { status };
};
