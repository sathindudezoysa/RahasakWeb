import { Message } from "../types/type";

export function KafkaListner(
  topic: string,
  onMessage?: (msg: Message) => void,
) {
  const url = `http://localhost:8080/stream?topic=${encodeURIComponent(topic)}`;

  const eventSource = new EventSource(url);

  eventSource.onmessage = (event) => {
    try {
      const newMessage: Message = JSON.parse(event.data);
      const recipientId = newMessage.recipientId;

      if (!recipientId) {
        console.warn("Received message without recipientId:", newMessage);
        return;
      }

      const storageKey = `chat-${recipientId}`;

      const existingHistory = JSON.parse(
        localStorage.getItem(storageKey) || "[]",
      );

      existingHistory.push(newMessage);

      localStorage.setItem(storageKey, JSON.stringify(existingHistory));

      if (onMessage) onMessage(newMessage);
    } catch (error) {
      console.error("Error processing Kafka message:", error);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE connection error:", err);
  };

  return eventSource;
}
