// // components/TiptapEditor.js
// "use client";

// import { useEditor, EditorContent } from "@tiptap/react";
// import StarterKit from "@tiptap/starter-kit";
// import Underline from "@tiptap/extension-underline";
// import TextAlign from "@tiptap/extension-text-align";
// import Link from "@tiptap/extension-link";
// import React, { useEffect } from "react";

// export default function TiptapEditor({ value, onChange }) {
//     // const editor = useEditor({
//     //     extensions: [
//     //         StarterKit.configure({
//     //             heading: { levels: [1, 2] },
//     //         }),
//     //         Underline,
//     //         Link.configure({
//     //             openOnClick: true,
//     //         }),
//     //         TextAlign.configure({
//     //             types: ["heading", "paragraph"],
//     //         }),
//     //     ],
//     //     content: value,
//     //     onUpdate: ({ editor }) => {
//     //         onChange(editor.getHTML());
//     //     },
//     //     // ✅ Fix hydration mismatch in Next.js SSR
//     //     editorProps: {
//     //         attributes: {
//     //             class: "focus:outline-none",
//     //         },
//     //     },
//     //     // ✅ This is the key line
//     //     immediatelyRender: false,
//     // });
//     const editor = useEditor({
//         extensions: [
//             StarterKit.configure({
//                 heading: { levels: [1, 2] },
//             }),
//             Underline,
//             Link.configure({ openOnClick: true }),
//             TextAlign.configure({ types: ["heading", "paragraph"] }),
//         ],
//         content: value,
//         editorProps: {
//             attributes: {
//                 immediatelyRender: false,
//             },
//         },
//         onUpdate: ({ editor }) => {
//             // onChange(editor.getText()); // 🧼 Plain text only
//             const updatedHTML = editor.getHTML();

//             // Remove all HTML tags and convert <p> into line breaks
//             const plainText = updatedHTML
//                 .replace(/<p>/gi, '')             // Remove opening <p> tags
//                 .replace(/<\/p>/gi, '\n')         // Replace closing </p> with line breaks
//                 .replace(/<br\s*\/?>/gi, '\n')    // Replace <br> with line breaks
//                 .replace(/<[^>]+>/g, '')          // Remove all other tags
//                 .trim();

//             // Optional: split into lines if you need it
//             const lines = plainText.split('\n').filter(line => line.trim() !== '');

//         },
//     });

//     useEffect(() => {
//         if (editor && value !== editor.getHTML()) {
//             editor.commands.setContent(value);
//         }
//     }, [value, editor]);

//     if (!editor) return null;

//     return (
//         <div className="border rounded p-3">
//             <div className="flex gap-2 mb-3 flex-wrap">
//                 <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">Bold</button>
//                 <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">Italic</button>
//                 <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded">Underline</button>
//                 <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className="px-2 py-1 border rounded">Left</button>
//                 <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className="px-2 py-1 border rounded">Center</button>
//                 <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className="px-2 py-1 border rounded">Right</button>
//                 <button
//                     onClick={() => {
//                         const url = prompt("Enter URL:");
//                         if (url) {
//                             editor.chain().focus().setLink({ href: url }).run();
//                         }
//                     }}
//                     className="px-2 py-1 border rounded"
//                 >
//                     Add Link
//                 </button>
//                 <button
//                     onClick={() => editor.chain().focus().unsetLink().run()}
//                     className="px-2 py-1 border rounded"
//                 >
//                     Remove Link
//                 </button>
//             </div>

//             <EditorContent editor={editor} className="min-h-[120px] border p-2 rounded" />
//         </div>
//     );
// }


"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import React, { useEffect } from "react";

export default function TiptapEditor({ value, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2] },
            }),
            Underline,
            Link.configure({ openOnClick: true }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
        ],
        content: value,

        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const cleaned = html.replace(/<\/?p>/g, "").trim(); // remove <p> tags only
            onChange(cleaned);
        },

        editorProps: {
            attributes: {
                class: "focus:outline-none",
            },
        },
        // 🔐 SSR-safe rendering
        autofocus: false,
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <div className="border rounded p-3">
            <div className="flex gap-2 mb-3 flex-wrap">
                <button onClick={() => editor.chain().focus().toggleBold().run()} className="px-2 py-1 border rounded">Bold</button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className="px-2 py-1 border rounded">Italic</button>
                <button onClick={() => editor.chain().focus().toggleUnderline().run()} className="px-2 py-1 border rounded">Underline</button>
                <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className="px-2 py-1 border rounded">Left</button>
                <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className="px-2 py-1 border rounded">Center</button>
                <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className="px-2 py-1 border rounded">Right</button>
                <button
                    onClick={() => {
                        const url = prompt("Enter URL:");
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    className="px-2 py-1 border rounded"
                >
                    Add Link
                </button>
                <button
                    onClick={() => editor.chain().focus().unsetLink().run()}
                    className="px-2 py-1 border rounded"
                >
                    Remove Link
                </button>
            </div>

            <EditorContent editor={editor} className="min-h-[120px] border p-2 rounded" />
        </div>
    );
}
