import React from "react";

const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  return (
    <textarea
      placeholder="Ask Merido"
      className="w-full p-2 border border-gray-300 rounded-b-md"
      rows={1}
      onInput={(e) => {
        const textarea = e.currentTarget;
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }}
      {...props}
    />
  );
};

export default Textarea;
