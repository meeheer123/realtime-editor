import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Client from "../components/Client";
import Editor from "../components/Editor";
import { initSocket } from "../socket";
import { ACTIONS } from "../Actions";
import { useLocation, useNavigate, Navigate, useParams } from "react-router-dom";

const EditorPage = () => {
	const socketRef = useRef(null);
	const location = useLocation();
	const { roomId } = useParams();
	const reactNavigator = useNavigate();
	const [clients, setClients] = useState([
		
	]);

	useEffect(() => {
		const init = async () => {
			socketRef.current = await initSocket();
			socketRef.current.on("connect_error", (err) => handleErrors(err));
			socketRef.current.on("connect_failed", (err) => handleErrors(err));

			function handleErrors(e)
			{
				console.log('socket error', e);
				toast.error('Socket connection failed, try again later.');
				reactNavigator('/');
			}

			socketRef.current.emit(ACTIONS.JOIN, {
				roomId,
				username: location.state?.username,
			});
			// listning to joined event
			socketRef.current.on("joined", ({clients, username, socketId}) => {
				if (username !== location.state?.username)
				{
					toast.success(`${username} joined the room`);
					console.log(`${username} joined the room`);
				}
				setClients(clients);
			});

			// listining for disconnected
			socketRef.current.on("disconnected", ({socketId, username}) => {
				toast.error(`${username} left the room`);
				setClients((prevClients) => prevClients.filter((client) => client.socketId !== socketId));
			});

		};
		init();
		return () => {
			socketRef.current.disconnect();
			socketRef.current.off('joined', 'disconnected');
		}
	}, []);

	if (!location.state)
	{
		return	<Navigate to="/" />
	}

	return (
		<div className="mainWrap">
			<div className="aside">
				<div className="asideInner">
					<h3 className="h3wala">Connected Users</h3>
					<div className="clientList">
						{clients.map((client) => (
							<Client key={client.socketId} username={client.username} />
						))}
					</div>
				</div>
				<button className="btn copyBtn">Share Room Id</button>
				<button className="btn leaveBtn">Leave</button>
			</div>
			<div className="editorWrap">
				<Editor socketRef={socketRef} roomId={roomId}/>
			</div>
		</div>
	);
};

export default EditorPage;
