"use client"
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import React, { useEffect } from "react"
// Custom Bold that renders with inline style
const CustomBold = Bold.extend({
    renderHTML({ HTMLAttributes }) {
        return ["span", { ...HTMLAttributes, style: "font-weight: bold;" }, 0];
    },
})
// Custom Underline with inline style
const CustomUnderline = Underline.extend({
    renderHTML({ HTMLAttributes }) {
        return ["span", { ...HTMLAttributes, style: "text-decoration: underline;" }, 0];
    },
})
// Custom Italic with inline style
const CustomItalic = Italic.extend({
    renderHTML({ HTMLAttributes }) {
        return ["span", { ...HTMLAttributes, style: "font-style: italic;" }, 0];
    },
})
export default function TiptapEditor({ value, onChange }) {
    const editor = useEditor({
        content: value || "",
        extensions: [
            StarterKit.configure({
                bold: false,
                italic: false,
                underline: false,
            }),
            CustomBold,
            CustomUnderline,
            CustomItalic,
        ],
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            // Remove all HTML tags except inline styles
            const cleaned = html
                .replace(/<\/?p>/g, "") // remove <p> tags
                .replace(/<(\/)?(strong|b|u|em|i)>/g, "") // remove bold/italic/underline tags
                .trim()
            onChange(cleaned);
        },
    })
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor])
    if (!editor) return null
    return (
        <div className="border rounded p-3">
            <div className="flex gap-2 mb-3 flex-wrap">
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className="px-2 py-1 border rounded"
                >
                    Bold
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className="px-2 py-1 border rounded"
                >
                    Italic
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    className="px-2 py-1 border rounded"
                >
                    Underline
                </button>
            </div>
            <EditorContent editor={editor} className="min-h-[120px] border p-2 rounded" />
        </div>
    );
}


// "use client";

// import React, { useState, useEffect } from "react";
// import Editor from "@monaco-editor/react"; // Correct import

// export default function MonacoEditorComponent({ value, onChange }) {
//     const [editorValue, setEditorValue] = useState(value || "");
//     const [styledText, setStyledText] = useState([]); // Array to store text with styles

//     // Handle editor changes
//     const handleEditorChange = (newValue) => {
//         setEditorValue(newValue);
//         onChange(newValue); // Pass the updated value to the parent component
//     };

//     // Apply formatting to the selected text
//     const applyFormatting = (format) => {
//         const editor = document.querySelector(".monaco-editor textarea");
//         if (!editor) return;

//         const start = editor.selectionStart;
//         const end = editor.selectionEnd;
//         const selectedText = editor.value.substring(start, end);

//         if (!selectedText) return; // Do nothing if no text is selected

//         // Add style metadata for the selected text
//         const newStyledText = [
//             ...styledText,
//             {
//                 text: selectedText,
//                 style: format, // e.g., "bold", "italic", "underline"
//                 start,
//                 end,
//             },
//         ];

//         setStyledText(newStyledText);

//         // Update the editor value (plain text remains unchanged)
//         const newValue =
//             editor.value.substring(0, start) +
//             selectedText +
//             editor.value.substring(end);

//         setEditorValue(newValue);
//         onChange(newValue);
//     };

//     useEffect(() => {
//         if (value !== editorValue) {
//             setEditorValue(value || "");
//         }
//     }, [value]);

//     return (
//         <div className="border rounded p-3">
//             <div className="flex gap-2 mb-3 flex-wrap">
//                 <button
//                     onClick={() => applyFormatting("bold")}
//                     className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
//                 >
//                     Bold
//                 </button>
//                 <button
//                     onClick={() => applyFormatting("italic")}
//                     className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition duration-200"
//                 >
//                     Italic
//                 </button>
//                 <button
//                     onClick={() => applyFormatting("underline")}
//                     className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition duration-200"
//                 >
//                     Underline
//                 </button>
//             </div>
//             <Editor
//                 height="300px"
//                 defaultLanguage="plaintext" // You can change this to "markdown", "html", etc.
//                 value={editorValue}
//                 onChange={handleEditorChange}
//                 options={{
//                     minimap: { enabled: false },
//                     fontSize: 14,
//                     scrollBeyondLastLine: false,
//                     wordWrap: "on",
//                 }}
//             />
//             <div className="mt-4">
//                 <h3 className="font-bold">Styled Text Metadata:</h3>
//                 <pre className="bg-gray-100 p-2 rounded">{JSON.stringify(styledText, null, 2)}</pre>
//             </div>
//         </div>
//     );
// }

// "use client";

// import dynamic from "next/dynamic";
// import { useEffect, useState } from "react";
// import { EditorState, convertToRaw, ContentState } from "draft-js";
// import draftToHtml from "draftjs-to-html";
// import htmlToDraft from "html-to-draftjs";

// // Dynamically import Editor only on client
// const Editor = dynamic(
//     () => import("react-draft-wysiwyg").then(mod => mod.Editor),
//     { ssr: false }
// );

// import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

// export default function RichTextEditor({ value = "", onChange }) {
//     const [editorState, setEditorState] = useState(() =>
//         EditorState.createEmpty()
//     );
//     const [isMounted, setIsMounted] = useState(false);

//     useEffect(() => {
//         setIsMounted(true);
//     }, []);

//     useEffect(() => {
//         if (isMounted && value) {
//             const blocksFromHtml = htmlToDraft(value);
//             const contentState = ContentState.createFromBlockArray(
//                 blocksFromHtml.contentBlocks,
//                 blocksFromHtml.entityMap
//             );
//             setEditorState(EditorState.createWithContent(contentState));
//         }
//     }, [isMounted, value]);

//     const handleEditorChange = (state) => {
//         setEditorState(state);
//         const htmlContent = draftToHtml(convertToRaw(state.getCurrentContent()));
//         onChange?.(htmlContent);
//     };

//     if (!isMounted) return null;

//     return (
//         <div className="border rounded p-4">
//             <Editor
//                 editorState={editorState}
//                 onEditorStateChange={handleEditorChange}
//                 wrapperClassName="border rounded"
//                 editorClassName="min-h-[200px] p-2"
//                 toolbarClassName="border-b"
//             />
//         </div>
//     );
// }

