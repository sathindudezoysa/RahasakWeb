import { Message } from "../types/type";

export function KafkaListner(
  topic: string,
  onMessage?: (msg: Message[]) => void,
) {
  const url = `http://localhost:8080/stream?topic=${encodeURIComponent(topic)}`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    console.log("RAW SSE EVENT:", event.data);

    try {
      let parsed = JSON.parse(event.data);

      // 🔥 Handle double-encoded JSON
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }

      if (!parsed || typeof parsed !== "object") {
        console.warn("Invalid SSE payload:", parsed);
        return;
      }

      const { recipientId } = parsed;

      if (!recipientId) {
        console.warn("Received message without recipientId:", parsed);
        return;
      }

      const storageKey = `chat-${recipientId}`;

      const existingHistory = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      );

      existingHistory.push(parsed);
      localStorage.setItem(storageKey, JSON.stringify(existingHistory));
    } catch (err) {
      console.error("SSE parse error:", err, event.data);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE connection error:", err);
  };

  return eventSource;
}
