"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roomCount = exports.liveCursors = exports.joinRoom = exports.clientSocket = exports.RoomProvider = void 0;
var _server = require("@dpapi/server");
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function _iterableToArrayLimit(arr, i) { var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"]; if (null != _i) { var _s, _e, _x, _r, _arr = [], _n = !0, _d = !1; try { if (_x = (_i = _i.call(arr)).next, 0 === i) { if (Object(_i) !== _i) return; _n = !1; } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0); } catch (err) { _d = !0, _e = err; } finally { try { if (!_n && null != _i["return"] && (_r = _i["return"](), Object(_r) !== _r)) return; } finally { if (_d) throw _e; } } return _arr; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
// Creating client context
var clientSocket = /*#__PURE__*/(0, _react.createContext)();

// Pass through of socket values to all child components within the room
exports.clientSocket = clientSocket;
var RoomProvider = function RoomProvider(_ref) {
  var children = _ref.children;
  var socket = _server.createClient;
  return /*#__PURE__*/_react["default"].createElement(clientSocket.Provider, {
    value: socket
  }, children);
};

// Joining room and managing browser back button & mouse movement events
exports.RoomProvider = RoomProvider;
var joinRoom = function joinRoom(roomID, socket) {
  socket.emit("firebaseUser", {
    socketId: socket.id,
    room: roomID
  });
  (0, _react.useEffect)(function () {
    window.onpopstate = function (e) {
      socket.emit("backrefresh");
    };
    document.addEventListener("mousemove", function (event) {
      socket.emit("mouseMove", {
        socketId: socket.id,
        x: event.clientX,
        y: event.clientY
      });
    });
  }, [socket]);
};

// Calculating count of users in room
exports.joinRoom = joinRoom;
var roomCount = function roomCount(roomID, socket) {
  var _useState = (0, _react.useState)(0),
    _useState2 = _slicedToArray(_useState, 2),
    allRoomUsers = _useState2[0],
    setRoomUsers = _useState2[1];
  (0, _react.useEffect)(function () {
    socket.on("allRoomUsers", function (data) {
      var roomdata = data.filter(function (obj) {
        return obj.room === roomID;
      });
      setRoomUsers(roomdata.length);
    });
    return function () {
      socket.off("allRoomUsers");
    };
  }, [socket]);
  return allRoomUsers;
};

// Setting and updating cursor positions of all users in room
exports.roomCount = roomCount;
var liveCursors = function liveCursors(roomID, socket) {
  var _useState3 = (0, _react.useState)([]),
    _useState4 = _slicedToArray(_useState3, 2),
    otherCursors = _useState4[0],
    setOtherCursors = _useState4[1];
  (0, _react.useEffect)(function () {
    socket.on("cursorUpdate", function (data) {
      var roomdata = data.filter(function (obj) {
        return obj.room === roomID;
      });
      setOtherCursors(roomdata);
    });
  }, [socket]);
  return otherCursors;
};
exports.liveCursors = liveCursors;