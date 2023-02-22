import { createClient } from "@dpapi/server";
import React, { createContext, useState, useEffect } from "react";

// Creating client context
export const clientSocket = createContext();

// Pass through of socket values to all child components within the room
export const RoomProvider = ({ children }) => {
  const socket = createClient;
  return (
    <clientSocket.Provider value={socket}>{children}</clientSocket.Provider>
  );
};

// Joining room and managing browser back button & mouse movement events
export const joinRoom = (roomID, socket) => {
  socket.emit("firebaseUser", {
    socketId: socket.id,
    room: roomID,
  });
  useEffect(() => {
    window.onpopstate = (e) => {
      socket.emit("backrefresh");
    };
    document.addEventListener("mousemove", (event) => {
    socket.emit("mouseMove", {
      socketId: socket.id,
      x: event.clientX,
      y: event.clientY,
    });
  });
}, [socket]);
};

// Calculating count of users in room
export const roomCount = (roomID, socket) => {
  const [allRoomUsers, setRoomUsers] = useState(0);
  useEffect(() => {
    socket.on("allRoomUsers", (data) => {
      let roomdata = data.filter((obj) => obj.room === roomID);
      setRoomUsers(roomdata.length);
    });
    return () => {
      socket.off("allRoomUsers");
    };
  }, [socket]);
  return allRoomUsers;
};

// Setting and updating cursor positions of all users in room
export const liveCursors = (roomID, socket) => {
  const [otherCursors, setOtherCursors] = useState([]);
  useEffect(() => {
    socket.on("cursorUpdate", (data) => {
      let roomdata = data.filter((obj) => obj.room === roomID);
      setOtherCursors(roomdata);
    });
  }, [socket]);
  return otherCursors;
};
