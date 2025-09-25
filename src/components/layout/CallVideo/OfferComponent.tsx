"use client";
import uniqBy from "lodash/unionBy";
import {
  EllipsisVertical,
  MessageCircleCode,
  Mic,
  MicOff,
  Video,
  VideoOff,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Peer, { SignalData } from "simple-peer";
import { toast } from "sonner";

import { socket } from "@/configs/socket";
import { IGroup } from "@/features/chats/type";
import { cn, handleError } from "@/lib/utils";
import { useMyStore } from "@/store/zustand";
import { User } from "@/types/types";

import CallVideoItem from "./CallVideoItem";
import OfferrinngCall from "./OfferrinngCall";

export interface IPeer {
  userId: string;
  peer: Peer.Instance;
}
interface IUserInRoom {
  user: User;
  groupId: string;
  order: number;
  allowMic: boolean;
  allowCam: boolean;
}
export interface PeerWithPC extends Peer.Instance {
  _pc: RTCPeerConnection;
}
const OfferComponent = () => {
  const myUser = useMyStore().myUser;
  const [status, setStatus] = useState<"" | "isOfferring" | "isCalling">("");
  const [connectingCount, setConnectingCount] = useState(0);
  const [initUser, setInitUser] = useState<User | null>(null);
  const [allowMic, setAllowMic] = useState(true);
  const [allowCamera, setAllowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [groupChat, setGroupChat] = useState<IGroup | null>(null);
  const [peers, setPeers] = useState<IPeer[]>([]);
  const [offeringUser, setOfferingUser] = useState<User[]>([]);
  const [userInRoom, setUserInRoom] = useState<IUserInRoom[] | []>([]);
  const partner = groupChat?.members.find((u) => u._id !== initUser?._id);
  const isInitUser = initUser?._id === myUser?._id;
  // Ref
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | undefined>(undefined);
  const peersVideoRef = useRef<Record<string, HTMLVideoElement | null>>({});

  const handleCreatePeer = (
    initiator: boolean,
    targetUserId: string,
    peerStream: MediaStream | undefined,
  ) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      config: {
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      },
    });

    // gửi từng track cho peer
    if (peerStream) {
      peerStream.getTracks().forEach((track) => {
        peer.addTrack(track, peerStream);
      });
    }

    peer.on("signal", (signal) => {
      socket.emit("signal", {
        sender: myUser?._id,
        receiver: targetUserId,
        signal,
      });
    });
    peer.on("connect", () => {
      console.log("Connect successfully to peer", targetUserId);
    });
    peer.on("track", (track) => {
      const videoEl = peersVideoRef.current[targetUserId];
      if (videoEl) {
        if (!videoEl.srcObject) {
          // Nếu chưa có stream thì gán
          videoEl.srcObject = new MediaStream([track]);
        } else {
          // Nếu đã có stream thì add track
          const mediaStream = videoEl.srcObject as MediaStream;
          if (!mediaStream.getTracks().find((t) => t.id === track.id)) {
            mediaStream.addTrack(track);
          }
        }
      }
    });
    peer.on("error", (err) => {
      console.log("Errors in connection", err);

      socket.emit("error-leave", {
        groupId: groupChat?._id,
        uId: targetUserId,
      });
    });
    peer.on("close", () => {
      const videoEl = peersVideoRef.current[targetUserId];
      if (videoEl && videoEl.srcObject) {
        const stream = videoEl.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoEl.srcObject = null;
      }
    });
    setPeers((prev) =>
      uniqBy([...prev, { userId: targetUserId, peer }], "userId"),
    );
    return peer;
  };
  const handleResetCall = () => {
    document.body.style.overflow = "auto";
    setStatus("");
    setAllowMic(true);
    setAllowCamera(false);
    setConnectingCount(0);
    setPeers([]);
    setOfferingUser([]);
    setUserInRoom([]);
    setInitUser(null);
    setGroupChat(null);
  };
  const handleDenyCall = useCallback(() => {
    handleResetCall();
    socket.emit("user-deny", {
      userId: myUser?._id,
      isGroup: groupChat?.isGroup,
      initCaller: initUser?._id,
    });
  }, [myUser?._id, groupChat?._id]);
  const handleAcceptCall = useCallback(() => {
    const newUserInRoom: IUserInRoom = {
      user: myUser as User,
      groupId: groupChat?._id as string,
      order: userInRoom.length + 1,
      allowMic,
      allowCam: allowCamera,
    };
    const listUserInRoom = [...userInRoom, newUserInRoom];

    socket.emit("user-join-call", {
      groupId: groupChat?._id,
      list: listUserInRoom,
    });
  }, [myUser?._id, groupChat?._id, userInRoom]);
  const handleLeaveCall = useCallback(() => {
    const listUserRoom = userInRoom.filter((u) => u.user._id !== myUser?._id);
    socket.emit("user-leave-call", {
      groupId: groupChat?._id,
      list: listUserRoom,
      isGroup: groupChat?.isGroup,
      initUser: initUser?._id,
      userLeave: myUser?._id,
    });
    handleResetCall();
  }, [userInRoom]);
  const toggleAllowCamera = useCallback(() => {
    socket.emit("user-change-cam", {
      groupId: groupChat?._id,
      allowCamera: !allowCamera,
      uId: myUser?._id,
    });
    setAllowCamera((prev) => !prev);
  }, [allowCamera, groupChat?._id, myUser?._id]);
  const toggleAllowMic = useCallback(() => {
    setAllowMic((prev) => !prev);
    socket.emit("user-change-mic", {
      groupId: groupChat?._id,
      allowMic: !allowMic,
      uId: myUser?._id,
    });
  }, [allowMic, groupChat?._id, myUser?._id]);
  // Memozied
  const initUserMemozied = useMemo(() => initUser, [initUser]);
  const groupChatMemozied = useMemo(() => groupChat, [groupChat]);
  useEffect(() => {
    streamRef.current = stream;
  }, [stream]);
  useEffect(() => {
    if (status !== "isOfferring") return;
    if (connectingCount === 3000) {
      handleResetCall();
    }
    const interval = setInterval(() => {
      setConnectingCount((prev) => prev + 1);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [status, connectingCount]);
  useEffect(() => {
    if (!status) return;
    const initMedia = async () => {
      try {
        // Nếu chưa có stream thì tạo lần đầu
        if (!streamRef.current) {
          try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
              audio: {
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
                // Standard constraints mới hơn
                sampleRate: 48000,
                sampleSize: 16,
                channelCount: 1, // Mono để giảm echo
              },
              video: true,
            });

            // Disable theo trạng thái ban đầu
            mediaStream.getAudioTracks().forEach((track) => {
              track.enabled = allowMic;
            });
            mediaStream.getVideoTracks().forEach((track) => {
              track.enabled = allowCamera;
            });

            streamRef.current = mediaStream;
            setStream(mediaStream);

            if (myVideoRef.current) {
              myVideoRef.current.srcObject = mediaStream;
              myVideoRef.current.muted = true;
            }
          } catch (error) {
            handleError("initMedia", error);
          }
        } else {
          // Nếu đã có stream thì chỉ update enabled
          streamRef.current.getAudioTracks().forEach((track) => {
            track.enabled = allowMic;
          });
          streamRef.current.getVideoTracks().forEach((track) => {
            track.enabled = allowCamera;
          });
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = streamRef.current;
            myVideoRef.current.muted = true;
          }
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };

    initMedia();
  }, [status, allowMic, allowCamera]);
  useEffect(() => {
    socket.on(
      "init-call",
      (data: { sender: User; group: IGroup; membersOnline: User[] }) => {
        const { sender, group, membersOnline } = data;
        setInitUser(sender);
        setGroupChat(group);
        setStatus("isOfferring");
        setOfferingUser((prev) => [...prev, ...membersOnline]);
        if (sender._id !== myUser?._id) return;
        const newUserInRoom: IUserInRoom = {
          user: sender,
          groupId: group._id,
          order: 1,
          allowMic,
          allowCam: allowCamera,
        };
        const listUserInRoom = [...userInRoom, newUserInRoom];
        socket.emit("user-join-call", {
          groupId: group._id,
          list: listUserInRoom,
        });
      },
    );
    socket.on("user-deny", (uId: string) => {
      setOfferingUser((prev) => prev.filter((user) => user._id !== uId));
    });
    socket.on("user-join-call", (list: IUserInRoom[]) => {
      setUserInRoom(list);
      if (list.length === 1 && status === "isCalling") {
        socket.emit("delete-calling", String(initUser?._id));
        socket.emit("end-call", groupChat?._id);
        toast.info("Cuộc gọi đã kết thúc", {
          duration: 5000,
        });
        return;
      }
      if (status === "isCalling") return;
      const isJoin = list.find((u) => u.user._id === String(myUser?._id));
      if (list.length > 1 && !!isJoin) {
        list.forEach((u) => {
          if (u.order < isJoin.order) {
            handleCreatePeer(true, u.user._id, streamRef.current);
          }
        });
      }

      if (isJoin && list.length > 1) {
        setStatus("isCalling");
      }
    });
    socket.on("end-call", () => {
      socket.emit("delete-calling", String(myUser?._id));
      handleResetCall();
    });
    socket.on("user-change-mic", (data: { uId: string; allowMic: boolean }) => {
      const { uId, allowMic } = data;
      setUserInRoom((prev) =>
        prev.map((u) => (u.user._id === uId ? { ...u, allowMic } : u)),
      );
      if (uId === String(myUser?._id)) return;
      const videoRef = peersVideoRef.current[uId]?.srcObject as MediaStream;
      if (videoRef) {
        videoRef.getAudioTracks().forEach((track) => {
          track.enabled = allowMic;
        });
      }
    });
    socket.on(
      "user-change-cam",
      async (data: { uId: string; allowCamera: boolean }) => {
        const { uId, allowCamera } = data;
        setUserInRoom((prev) =>
          prev.map((u) =>
            u.user._id === uId ? { ...u, allowCam: allowCamera } : u,
          ),
        );
        if (uId === String(myUser?._id)) {
          return;
        }
        const videoRef = peersVideoRef.current[uId]?.srcObject as MediaStream;
        if (videoRef) {
          videoRef.getVideoTracks().forEach((track) => {
            track.enabled = allowCamera;
          });
        }
      },
    );
    socket.on("error-leave", (data: { uId: string; groupId: string }) => {
      if (!status) return;
      const { uId } = data;
      const newList = userInRoom.filter((u) => u.user._id !== uId);
      if (newList.length === 1 && status === "isCalling") {
        socket.emit("delete-calling", String(initUser?._id));
        socket.emit("end-call", groupChat?._id);
        toast.info("Cuộc gọi đã kết thúc", {
          duration: 5000,
        });
        return;
      }
      setUserInRoom(newList);
    });
    return () => {
      socket.off("init-call");
      socket.off("user-deny");
      socket.off("user-join-call");
      socket.off("end-call");
      socket.off("user-change-mic");
      socket.off("user-change-cam");
      socket.off("error-leave");
    };
  }, [myUser?._id, status, userInRoom, streamRef.current]);
  useEffect(() => {
    if (offeringUser.length === 1) {
      socket.emit("delete-calling", String(initUser?._id));
      toast.info("Cuộc gọi đã kết thúc");
      handleResetCall();
    }
  }, [offeringUser.length]);
  useEffect(() => {
    socket.on(
      "signal",
      (data: { sender: string; receiver: string; signal: SignalData }) => {
        if (data.signal.type === "offer") {
          const newPeer = handleCreatePeer(
            false,
            data.sender,
            streamRef.current,
          );
          newPeer.signal(data.signal);

          return;
        }
        if (
          data.signal.type === "answer" ||
          data.signal.type === "renegotiate"
        ) {
          const peer = peers.find((p) => p.userId === data.sender);
          if (peer) {
            peer.peer.signal(data.signal);
          }
          return;
        }
      },
    );
    return () => {
      socket.off("signal");
    };
  }, [status, userInRoom.length, peers]);

  if (!status) return null;
  return (
    <div className="bg-black/50 fixed inset-0 z-[60] flex items-center justify-center">
      <div
        className={cn(
          "h-full w-full lg:w-[50%] bg-primary-gray  flex items-center justify-center overflow-y-auto hidden-scrollbar",
          status === "isCalling" && "flex-col",
          groupChat?.isGroup && status === "isCalling" && "lg:!w-full",
        )}
      >
        {status === "isOfferring" && (
          <OfferrinngCall
            groupChat={groupChatMemozied}
            initUser={initUserMemozied}
            onDenyCall={handleDenyCall}
            onAcceptCall={handleAcceptCall}
          ></OfferrinngCall>
        )}
        {status === "isCalling" && (
          <>
            <div className="flex items-center gap-x-3 justify-between w-full bg-primary-gray  p-2 md:px-4 lg:w-[50%]">
              <div className="flex items-center justify-center flex-col gap-y-1 md:flex-row gap-x-2">
                <div className="size-4 md:size-6 bg-white rounded-full flex items-center justify-center">
                  <motion.div
                    initial={{ opacity: 0.3 }}
                    animate={{
                      opacity: 1,
                      transition: {
                        repeat: Infinity,
                        ease: "linear",
                        duration: 2,
                      },
                    }}
                    className="size-1.5 md:size-2 bg-red-700 rounded-full"
                  ></motion.div>
                </div>
                <p className="text-xs md:text-sm font-semibold text-second-gray">
                  05:00
                </p>
              </div>
              <h3 className="uppercase shrink-0 font-bold text-sm max-w-[50%] line-clamp-2">
                {groupChat?.isGroup
                  ? groupChat?.groupName
                  : isInitUser
                    ? partner?.name
                    : initUser?.name}
              </h3>
              <div className="flex items-center gap-x-3">
                <button className="p-3 rounded-full bg-second-button-background flex items-center justify-center">
                  <MessageCircleCode />
                </button>
                <button className="p-3 rounded-full bg-second-button-background flex items-center justify-center">
                  <EllipsisVertical />
                </button>
              </div>
            </div>
            <ul
              className={cn(
                "call-box p-0 size-full flex-wrap snap-y snap-mandatory flex gap-2   relative overflow-y-auto hidden-scrollbar  md:gap-4 bg-second-button-background    ",
                groupChat?.isGroup &&
                  " p-2 md:p-4 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ",
              )}
            >
              <li
                className={cn(
                  "w-full aspect-square md:aspect-[2/3] xl:aspect-square shrink-0 snap-start  bg-black relative rounded-lg flex items-center justify-center",
                  !groupChat?.isGroup &&
                    "absolute top-3 right-3 z-20 w-[120px] md:w-[150px] lg:w-[200px] h-[180px] md:h-[230px] xl:h-[280px]",
                )}
              >
                {allowCamera ? (
                  <video
                    ref={myVideoRef}
                    className="size-full object-cover rounded-lg"
                    autoPlay
                    muted
                  ></video>
                ) : (
                  <>
                    <video
                      ref={myVideoRef}
                      className={cn(
                        "size-full object-cover rounded-lg hidden",
                        allowCamera && "block",
                      )}
                      autoPlay
                      playsInline
                      muted
                    ></video>
                    <figure
                      className={cn(
                        "size-[100px] md:size-[150px] lg:size-[200px] rounded-full",
                        !groupChat?.isGroup && "size-[50px] md:!size-[100px]",
                      )}
                    >
                      <Image
                        src={myUser?.avatar || "/images/default.jpg"}
                        alt="video-call-user-avt"
                        width={200}
                        height={200}
                        className="size-full rounded-full object-cover"
                      ></Image>
                    </figure>
                  </>
                )}

                <div
                  className={cn(
                    "p-2  absolute bottom-3 left-3 z-10 bg-second-button-background rounded-full",
                    !groupChat?.isGroup && "bottom-1 right-1 left-auto",
                  )}
                >
                  {allowMic ? (
                    <Mic className="text-green-500 size-4 md:size-6" />
                  ) : (
                    <MicOff className="text-red-500 size-4 md:size-6" />
                  )}
                </div>
                <p
                  className={cn(
                    "px-3 py-1 absolute right-3 text-xs font-semibold bottom-3 z-10 rounded-lg bg-second-button-background",
                    !groupChat?.isGroup && "hidden",
                  )}
                >
                  {myUser?.name}
                </p>
              </li>

              {userInRoom
                .filter((u) => u.user._id !== String(myUser?._id))
                .map((item) => (
                  <CallVideoItem
                    key={item.user._id}
                    allowMic={item.allowMic}
                    allowCam={item.allowCam}
                    userInfo={item.user}
                    groupChat={groupChat as IGroup}
                    peersVideoRef={peersVideoRef}
                  ></CallVideoItem>
                ))}
            </ul>
            <div className="call-buttons w-full py-3 bg-primary-gray flex justify-center items-center">
              <div className="flex items-center justify-evenly w-[80%] md:w-[60%] mx-auto">
                <button
                  onClick={toggleAllowMic}
                  className="p-3 md:p-4 bg-second-button-background rounded-full"
                >
                  {allowMic ? (
                    <Mic className="text-green-500" />
                  ) : (
                    <MicOff className="text-red-500" />
                  )}
                </button>
                <button
                  onClick={toggleAllowCamera}
                  className="p-3 md:p-4 bg-second-button-background rounded-full"
                >
                  {allowCamera ? (
                    <Video className="text-green-500" />
                  ) : (
                    <VideoOff className="text-red-500" />
                  )}
                </button>
                <button
                  onClick={handleLeaveCall}
                  className="p-3 md:p-4 rounded-full bg-red-500"
                >
                  <X />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OfferComponent;
