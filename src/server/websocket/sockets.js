import { connectAdmin, connectUser } from "@/core/chat";

export const SocketEvent = {
  ERROR: "error",
  ACCEPT_CHAT: "accept_chat",
  NEW_MESSAGE: "new_message",
  CLOSE_CHAT: "close_chat",
};

function socketError(socket, error) {
  socket.emit(SocketEvent.ERROR, error);
}

const users = new Map();

export async function initSocket(io) {
  io.on("connection", async (socket) => {
    const { token } = socket.handshake.auth;
    const chatId = socket.handshake.query.chatId?.toString();
    const isAdmin = socket.handshake.query.isAdmin || false;

    if (!chatId || !token) {
      socketError(socket, "Chat ID or token are not valid");
      socket.disconnect();
      return;
    }

    const { result, error } = isAdmin
      ? await connectAdmin(token, chatId)
      : await connectUser(token, chatId);

    if (error) {
      socketError(socket, error.message);
      socket.disconnect(true);
      return;
    }

    users.set(result, socket.id);

    socket.on("disconnect", () => {
      users.delete(result);
    });
  });
}

export function emitUserEvent(io, userId, event, payload) {
  const userSocketId = users.get(userId);
  if (userSocketId) {
    io.to(userSocketId).emit(event, payload);
  }
}

export function inWebSocket(id) {
  return users.has(id);
}
