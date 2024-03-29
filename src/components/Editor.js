import React, { useEffect, useRef } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import ACTIONS from "../Actions";

const Editor = ({ socketRef, roomId }) => {
	const editorRef = useRef(null);
	useEffect(() => {
		async function init() {
			editorRef.current = Codemirror.fromTextArea(
				document.getElementById("realtimeEditor"),
				{
					mode: { name: "javascript", json: true },
					theme: "dracula",
					autoCloseTags: true,
					autoCloseBrackets: true,
					lineNumbers: true,
				}
			);

			editorRef.current.on("change", (instance, changes) => {
				console.log(changes);
				const { origin } = changes;
				const code = instance.getValue();
				if (origin !== "setValue") {
					socketRef.current.emit(ACTIONS.CODE_CHANGE, {
						roomId,
						code,
					});
				}
			});

            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null)
                {
                    editorRef.current.setValue(code);
                }
            })

		}
		init();
	}, []);
	return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;
