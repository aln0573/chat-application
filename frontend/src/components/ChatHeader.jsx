import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const {onlineUsers} = useAuthStore()

  const isOnline = onlineUsers.includes(selectedUser._id)


  useEffect(() => {
    const handleEscKey = (e) => {
        if(e.key === 'Escape') setSelectedUser(null)
    }

    window.addEventListener("keydown", handleEscKey)

    return () => window.removeEventListener("keydown", handleEscKey)
  },[setSelectedUser])

  return (
    <div className="flex items-center justify-between bg-slate-800/50 border-b border-slate-700/50 max-h-[84px] px-6 py-4">
      
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <div className={`avatar ${isOnline ? "online" : "offline"}`}>
          <div className="w-12 rounded-full">
            <img
              src={selectedUser?.profilePic || "/avatar.png"}
              alt={selectedUser?.fullName}
            />
          </div>
        </div>

        <div>
          <h3 className="text-slate-200 font-medium">{selectedUser?.fullName}</h3>
          <p className="text-xs text-slate-400">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      {/* Right Section */}
      <button
        className="text-slate-400 hover:text-slate-200 transition-colors"
        onClick={() => setSelectedUser(null)}
      >
        Back
      </button>
    </div>
  );
};

export default ChatHeader;
