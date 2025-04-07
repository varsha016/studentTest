// components/ReactQuillEditor.js
"use client";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

// Load react-quill dynamically
const ReactQuill = dynamic(() => import("react-quill"), {
    ssr: false,
});

export default ReactQuill;
