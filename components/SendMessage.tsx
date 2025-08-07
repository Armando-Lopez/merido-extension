import React from "react";

export const SendMessage = ({
  sendMessage,
  disabled,
}: {
  sendMessage: (message: string) => void;
  disabled: boolean;
}) => {
  const [message, setMessage] = React.useState<string>("");

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    sendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={onSubmit}>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="flex-grow-1 flex flex-col justify-end">
        <button
          className="bg-[#f60] text-white p-2 rounded-md disabled:opacity-50"
          type="submit"
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </form>
  );
};
