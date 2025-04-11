

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

// Dynamically import Editor only on client
const Editor = dynamic(
    () => import("react-draft-wysiwyg").then(mod => mod.Editor),
    { ssr: false }
);

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

export default function RichTextEditor({ value = "", onChange }) {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted && value) {
            const blocksFromHtml = htmlToDraft(value);
            const contentState = ContentState.createFromBlockArray(
                blocksFromHtml.contentBlocks,
                blocksFromHtml.entityMap
            );
            setEditorState(EditorState.createWithContent(contentState));
        }
    }, [isMounted, value]);

    const handleEditorChange = (state) => {
        setEditorState(state);
        const htmlContent = draftToHtml(convertToRaw(state.getCurrentContent()));
        onChange?.(htmlContent);
    };

    if (!isMounted) return null;

    return (
        <div className="border rounded p-4">
            <Editor
                editorState={editorState}
                onEditorStateChange={handleEditorChange}
                wrapperClassName="border rounded"
                editorClassName="min-h-[200px] p-2"
                toolbarClassName="border-b"
            />
        </div>
    );
}

