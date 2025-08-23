"use client";
import { Mic, MicOff, PhoneCall, PhoneOff, Video, VideoOff } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { socket } from '@/configs/socket';
import { IGroup } from '@/features/chats/type';
import { cn } from '@/lib/utils';
import { useMyStore } from '@/store/zustand';
import { User } from '@/types/types';

interface PeerData {
    peer: Peer.Instance;
    userId: string;
    stream: MediaStream | undefined;
    hasMic?: boolean;
    hasVideo?: boolean;
}
interface UserInRoom {
    groupId: string;
    userId: string;
    sockedId: string;
    order: number;
}
type StatusCall = "isCalling" | "isOffering" | "";

const OfferComponent = () => {
    const { myUser } = useMyStore();
    const [initUser, setInitUser] = useState<User | null>(null);
    const [status, setStatus] = useState<StatusCall>("");
    const [offer, setOffer] = useState<{
        signal: Peer.SignalData;
        sender: string;
    }>();
    const [peers, setPeers] = useState<PeerData[]>([]);
    const [usersRoom, setUsersRoom] = useState<UserInRoom[]>([]);
    const [stream, setStream] = useState<MediaStream>();
    const [allowCam, setAllowCam] = useState(false);
    const [allowMic, setAllowMic] = useState(false);
    const myVideoRef = useRef<HTMLVideoElement>(null);
    const peerVideoRefs = useRef<{ [userId: string]: HTMLVideoElement | null }>(
        {}
    );
    const [group, setGroup] = useState<IGroup>();
    const [isVideoCall, setIsVideoCall] = useState(false);
    const inRoom =
        !!usersRoom.length && usersRoom.find((u) => u.userId === myUser?._id);
    const partner = !group?.isGroup
        ? group?.members.find((u) => u._id !== initUser?._id)
        : null;
    //start-func
    const createPeerConnection = (
        isInitiator: boolean,
        targetUserId?: string,
        other?: boolean
    ) => {
        const peer = new Peer({
            initiator: isInitiator,
            trickle: false,
            stream,
            config: {
                iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
            },
        });
        peer.on("signal", (signal) => {
            socket.emit(isInitiator ? "offer" : "answer", {
                groupId: group?._id,
                signal,
                sender: myUser?._id,
                receiver: targetUserId,
                other,
            });
        });
        peer.on("stream", (stream) => {
            console.log("Received remote stream:", stream, targetUserId);
            // Xử lý luồng media, ví dụ: gán vào video element
        });
        peer.on("error", (err) => {
            console.log(err);
        });

        return peer;
    };
    const handleAcceptOffer = async () => {
        socket.emit("join-room", {
            group,
            userId: myUser?._id,
        });
        let members: string[] = [];
        const inRoom = usersRoom.map((u) => u.userId);
        const myUId = group?.members.find(
            (user) => user._id === myUser?._id
        )?._id;
        const rest = group?.members
            .filter((u) => u._id !== myUId && !inRoom.includes(u._id))
            .map((u) => u._id);
        if (myUId && rest) {
            members = [...inRoom, myUId, ...rest];
        }
        const newPeers: PeerData[] = [];
        members.forEach((item, index) => {
            const myIndex = members.indexOf(myUId as string);
            if (item === myUId) return;
            if (item === initUser?._id) {
                const peerInit = createPeerConnection(false, initUser._id);
                if (offer) {
                    peerInit.signal(offer?.signal);
                }
                newPeers.push({
                    peer: peerInit,
                    userId: initUser._id,
                    stream,
                });
                return;
            }
            const isInitiator = myIndex > index;
            const peer = new Peer({
                initiator: isInitiator,
                trickle: false,
                stream,
                config: {
                    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
                },
            });
            newPeers.push({ peer: peer, userId: item, stream });
        });
        const other = usersRoom.filter(
            (u) => u.userId !== (initUser?._id as string)
        );
        if (other.length) {
            other.forEach((u) => {
                const userPeer = newPeers.find((p) => p.userId === u.userId);
                if (userPeer) {
                    userPeer.peer.on("signal", (signal) => {
                        socket.emit("offer", {
                            groupId: group?._id,
                            signal,
                            sender: myUser?._id,
                            receiver: u.userId,
                            other: true,
                        });
                    });
                }
            });
        }
        setPeers((prev) => [...prev, ...newPeers]);
        setStatus("isCalling");
        setOffer(undefined);
        setAllowMic(true);
    };
    const handleCallGroup = () => {
        socket.emit("join-room", { group, userId: myUser?._id });
        group?.members.forEach((user) => {
            if (user._id !== myUser?._id) {
                const newPeer = createPeerConnection(true, user._id);
                setPeers((prev) => [
                    ...prev,
                    { peer: newPeer, userId: user._id, stream },
                ]);
            }
        });
        setStatus("isOffering");
        setAllowMic(true);
    };
    const handleLeaveRoom = () => {
        socket.emit("user-leave", { groupId: group?._id, uId: myUser?._id });
        toast.info("Bạn đã rời khỏi cuộc gọi");
        handleReset();
    };
    const handleReset = () => {
        setGroup(undefined);
        setInitUser(null);
        setOffer(undefined);
        setStatus("");
        setPeers([]);
        setUsersRoom([]);
        setStream(undefined);
        setIsVideoCall(false);
        setAllowCam(false);
        setAllowMic(false);
    };

    const toggleCamera = () => {
        setAllowCam((prev) => {
            const newState = !prev;
            if (stream) {
                const videoTrack = stream.getVideoTracks()[0];
                if (videoTrack) {
                    videoTrack.enabled = newState;
                }
            }
            socket.emit("mediaStatusUpdate", {
                uId: myUser?._id,
                hasCamera: newState,
                hasMic: allowMic,
                groupId: group?._id,
            });
            return newState;
        });
    };
    const toggleMic = () => {
        setAllowMic((prev) => {
            const newState = !prev;
            if (stream) {
                const audioTrack = stream.getAudioTracks()[0];
                console.log("audioTrack", audioTrack);
                if (audioTrack) {
                    audioTrack.enabled = newState;
                }
            }
            socket.emit("mediaStatusUpdate", {
                uId: myUser?._id,
                hasCamera: allowCam,
                hasMic: newState,
                groupId: group?._id,
            });
            return newState;
        });
    };
    //end-func
    useEffect(() => {
        if (!allowCam && !allowMic) {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
                setStream(undefined);
            }
            return;
        }
        const getUserMedia = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: allowCam,
                    audio: allowMic,
                });

                if (myVideoRef.current && allowCam) {
                    myVideoRef.current.srcObject = stream;
                }
                peers.forEach((p) => {
                    if (p.peer && stream) {
                        p.peer.addStream(stream);
                    }
                });
                setStream(stream);
            } catch (err) {
                console.error("Error accessing media devices:", err);
            }
        };
        getUserMedia();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, [allowCam, allowMic]);
    useEffect(() => {
        socket.on(
            "user-in-room",
            (data: { result: UserInRoom[]; group: string }) => {
                if (group?._id !== data.group || !status) return;
                if (data.result.length < 2 && status) {
                    socket.emit("user-leave", {
                        groupId: group?._id,
                        uId: myUser?._id,
                    });
                    toast.error("Cuộc gọi đã kết thúc !", { duration: 4000 });
                    handleReset();
                    return;
                }
                setUsersRoom(data.result);
            }
        );
        socket.on("offer", ({ signal, sender, other }) => {
            // console.log(`Nhận offer từ ${sender}`);
            if (!other) {
                setOffer({ signal, sender });
                setStatus("isOffering");
                setIsVideoCall(true);
                return;
            }
            // console.log("Xử lý other offer");
            const existedPeer = peers.find((p) => p.userId === sender);
            if (existedPeer) {
                // console.log(`Send answer other`);
                existedPeer.peer.signal(signal);
                existedPeer.peer.on("signal", (signal) => {
                    socket.emit("answer", {
                        groupId: group?._id,
                        signal,
                        sender: myUser?._id,
                        receiver: sender,
                        other,
                    });
                });
            }
        });
        socket.on("answer", ({ sender, signal }) => {
            const signalPeer = peers.find((p) => p.userId === sender);
            if (signalPeer) {
                signalPeer.peer.signal(signal);

                setStatus("isCalling");
            }
        });
        socket.on("mediaStatusUpdate", async ({ uId, hasCamera, hasMic }) => {
            if (uId === myUser?._id) return;

            const peer = peers.find((p) => p.userId === uId);
            if (!peer) return;

            // Nếu cả camera và mic đều tắt, xóa stream
            if (!hasCamera && !hasMic) {
                if (peer.stream) {
                    peer.stream.getTracks().forEach((track) => track.stop());
                }
                setPeers((prev) =>
                    prev.map((p) =>
                        p.userId === uId
                            ? {
                                  ...p,
                                  stream: undefined,
                                  hasMic: false,
                                  hasVideo: false,
                              }
                            : p
                    )
                );
                return;
            }

            try {
                // Nếu có thay đổi về camera hoặc mic, tạo stream mới
                const newStream = await navigator.mediaDevices.getUserMedia({
                    video: !!hasCamera,
                    audio: !!hasMic,
                });

                if (peer.stream) {
                    peer.stream.getTracks().forEach((track) => track.stop());
                }

                setPeers((prev) =>
                    prev.map((p) =>
                        p.userId === uId
                            ? {
                                  ...p,
                                  stream: newStream,
                                  hasMic,
                                  hasVideo: hasCamera,
                              }
                            : p
                    )
                );
            } catch (err) {
                console.error("Error updating media stream:", err);
            }
        });
        socket.on("user-leave", (data: { groupId: string; uId: string }) => {
            if (!status) return;
            if (myUser?._id !== data.uId) {
                const userLeave = group?.members.find(
                    (u) => u._id === data.uId
                );
                toast.info(`${userLeave?.name} đã rời khỏi cuộc gọi`);
                setPeers((prev) => prev.filter((p) => p.userId !== data.uId));
                setUsersRoom((prev) =>
                    prev.filter((u) => u.userId !== data.uId)
                );
                return;
            }
        });

        return () => {
            socket.off("offer");
            socket.off("answer");
            socket.off("user-in-room");
            socket.off("mediaStatusUpdate");
            socket.off("user-leave");
        };
    }, [group?._id, myUser, initUser, peers, offer, usersRoom]);
    useEffect(() => {
        peers.forEach((p) => {
            if (p.stream && peerVideoRefs.current[p.userId]) {
                peerVideoRefs.current[p.userId]!.srcObject = p.stream;
            }
        });
    }, [peers]);
    useEffect(() => {
        socket.on("calling", (data: { user: User; group: IGroup }) => {
            if (String(data.user._id) !== String(myUser?._id)) {
                setGroup(data.group);
                setInitUser(data.user);
                return;
            }
            setGroup(data.group);
            setInitUser(data.user);
            setIsVideoCall(true);
        });
        if (isVideoCall && initUser?._id == myUser?._id && !usersRoom.length) {
            handleCallGroup();
        }
        return () => {
            socket.off("calling");
        };
    }, [isVideoCall, myUser?._id]);
    useEffect(() => {
        if (status) {
            document.body.style.overflow = "hidden";
        } else document.body.style.overflow = "auto";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, [status]);
    if (!status) return null;
    return (
        <div
            className={cn(
                "fixed bg-black/60 inset-0 z-[100]  hidden",
                isVideoCall && "flex items-center justify-center"
            )}
        >
            <div
                className={cn(
                    "bg-second-button-background lg:w-[50%] w-full mx-auto h-full flex flex-col-reverse justify-between items-center",
                    group?.isGroup && "lg:w-full"
                )}
            >
                {status == "isCalling" && (
                    <div className="flex items-center gap-x-4  bg-primary-gray w-full justify-center py-4">
                        <Button className="rounded-full" onClick={toggleMic}>
                            {allowMic ? (
                                <Mic className="text-green-500" />
                            ) : (
                                <MicOff className="text-red-500" />
                            )}
                        </Button>
                        <Button className="rounded-full" onClick={toggleCamera}>
                            {allowCam ? (
                                <Video className="text-green-500" />
                            ) : (
                                <VideoOff className="text-red-500" />
                            )}
                        </Button>
                        {status == "isCalling" && (
                            <Button
                                className="rounded-full"
                                onClick={handleLeaveRoom}
                                variant={"destructive"}
                            >
                                <PhoneOff />
                            </Button>
                        )}
                    </div>
                )}
                <div
                    className={cn(
                        "bg-second-button-background w-full flex-1 flex items-center justify-center max-h-[100vh] hidden-scrollbar overflow-y-auto",
                        !group?.isGroup && "p-0",
                        usersRoom.find((u) => u.userId === myUser?._id) &&
                            usersRoom.length > 1 &&
                            "items-start bg-primary-white"
                    )}
                >
                    {status === "isOffering" &&
                        initUser?._id !== myUser?._id && (
                            <div className="text-center flex flex-col gap-y-10 items-center w-full">
                                <p className="text-3xl font-semibold line-clamp-1 max-w-[60%] mx-auto">
                                    {initUser?.name}
                                </p>
                                <figure className="mt-4 size-[100px] rounded-full">
                                    <Image
                                        src={
                                            initUser?.avatar ||
                                            "/images/default.jpg"
                                        }
                                        alt="user-calling-avt"
                                        width={100}
                                        height={100}
                                        className="size-full rounded-full object-cover"
                                    ></Image>
                                </figure>
                                <p className="text-2xl">Đang gọi</p>
                                <div className="flex items-center gap-x-6 mt-3">
                                    <Button
                                        size={"lg"}
                                        className="rounded-full p-6 bg-green-400"
                                        onClick={handleAcceptOffer}
                                    >
                                        <PhoneCall />
                                    </Button>
                                    <Button
                                        size={"lg"}
                                        className="rounded-full p-6 bg-red-500"
                                    >
                                        <PhoneOff />
                                    </Button>
                                </div>
                            </div>
                        )}
                    {status === "isOffering" &&
                        initUser?._id === myUser?._id && (
                            <div className="text-center flex flex-col gap-y-10 items-center w-full">
                                <p className="text-3xl font-semibold line-clamp-1 max-w-[60%] mx-auto">
                                    {partner?.name || group?.groupName}
                                </p>
                                <figure className="mt-4 size-[100px] rounded-full">
                                    <Image
                                        src={
                                            partner?.avatar ||
                                            group?.groupAvt ||
                                            "/images/default.jpg"
                                        }
                                        alt="user-calling-avt"
                                        width={100}
                                        height={100}
                                        className="size-full rounded-full object-cover"
                                    ></Image>
                                </figure>
                                <p className="text-2xl">Đang kết nối...</p>
                            </div>
                        )}
                    {usersRoom.find((u) => u.userId === myUser?._id) && (
                        <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] xl:grid-cols-[repeat(auto-fill,minmax(600px,1fr))]  overflow-y-auto hidden-scrollbar gap-2 relative size-full p-2 md:p-4">
                            {status == "isCalling" && (
                                <li
                                    className={cn(
                                        "rounded-lg relative border  border-primary-gray bg-second-blue flex items-center justify-center h-full min-h-[300px] ",
                                        !group?.isGroup &&
                                            "absolute md:w-[180px] md:h-[200px] w-[120px] h-[150px] top-3 right-3 z-20 min-h-auto"
                                    )}
                                >
                                    <div className="absolute md:left-3 left-1 bottom-1 md:bottom-3 px-3 py-1 bg-black/50 rounded-full">
                                        <h2 className="text-sm font-semibold">
                                            Bạn
                                        </h2>
                                    </div>
                                    <div className="absolute p-2 bg-black/50 rounded-full md:bottom-3 bottom-1 right-1 md:right-3">
                                        {allowMic ? (
                                            <Mic className="size-5  text-green-500" />
                                        ) : (
                                            <MicOff className="size-5 text-red-500" />
                                        )}
                                    </div>
                                    {allowCam ? (
                                        <video
                                            ref={myVideoRef}
                                            autoPlay
                                            playsInline
                                            muted
                                            className="size-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <figure className="size-[80px] rounded-full">
                                            <Image
                                                src={
                                                    myUser?.avatar ||
                                                    "/images/default.jpg"
                                                }
                                                alt="user-avt"
                                                width={150}
                                                height={150}
                                                className="size-full object-cover rounded-full"
                                            ></Image>
                                        </figure>
                                    )}
                                </li>
                            )}
                            {inRoom &&
                                usersRoom.map((user) => {
                                    if (user.userId === myUser?._id)
                                        return null;
                                    const userStream = peers.find(
                                        (p) => p.userId === user.userId
                                    )?.hasVideo;

                                    const userInfo = group?.members.find(
                                        (u) => u._id === user.userId
                                    );
                                    const randomColor = `rgb(${Math.floor(
                                        Math.random() * 256
                                    )}, ${Math.floor(
                                        Math.random() * 256
                                    )}, ${Math.floor(Math.random() * 256)})`;
                                    return (
                                        <li
                                            style={{
                                                backgroundColor: randomColor,
                                            }}
                                            key={user.userId}
                                            className={cn(
                                                "rounded-lg relative flex items-center justify-center h-full min-h-[300px] border",
                                                !group?.isGroup &&
                                                    "absolute size-full rounded-none"
                                            )}
                                        >
                                            <div className="absolute left-3 bottom-3 px-3 py-1 bg-black/50 rounded-full">
                                                <h2 className="text-sm font-semibold">
                                                    {userInfo?.name}
                                                </h2>
                                            </div>
                                            <div className="absolute p-2 bg-black/50 rounded-full bottom-3 right-3">
                                                {peers.find(
                                                    (p) =>
                                                        p.userId === user.userId
                                                )?.hasMic ? (
                                                    <Mic className="size-5 text-green-500" />
                                                ) : (
                                                    <MicOff className="size-5 text-red-500" />
                                                )}
                                            </div>
                                            {userStream ? (
                                                <video
                                                    ref={(el) => {
                                                        if (el) {
                                                            peerVideoRefs.current[
                                                                user.userId
                                                            ] = el;
                                                        }
                                                    }}
                                                    autoPlay
                                                    playsInline
                                                    className={cn(
                                                        "size-full rounded-lg object-cover",
                                                        !group?.isGroup &&
                                                            "rounded-none"
                                                    )}
                                                />
                                            ) : (
                                                <figure
                                                    className={cn(
                                                        "size-[80px] rounded-full",
                                                        !group?.isGroup &&
                                                            "size-[200px]"
                                                    )}
                                                >
                                                    <Image
                                                        src={
                                                            userInfo?.avatar ||
                                                            "/images/default.jpg"
                                                        }
                                                        alt="user-avt"
                                                        width={400}
                                                        height={400}
                                                        className="size-full object-cover rounded-full"
                                                    ></Image>
                                                </figure>
                                            )}
                                        </li>
                                    );
                                })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OfferComponent;
