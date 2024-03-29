"use client";
import React from 'react';
import { FiPaperclip } from 'react-icons/fi';

export interface ChatInputProps {
  /** The current value of the input */
  input?: string;
  /** An input/textarea-ready onChange handler to control the value of the input */
  handleInputChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  /** Form submission handler to automatically reset input and append a user message  */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  multiModal?: boolean;
}

export default function ChatInput(props: ChatInputProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null); // Create a ref for the file input

  const handlePaperclipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];

      if (file) {
        setIsLoading(true);
        setError(null);
  
        const formData = new FormData();
        formData.append('file', file);

        fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('File upload failed');
          }
          return response.json();
        })
        .then(data => {
          setIsLoading(false);
        })
        .catch(error => {
          setError('File upload failed');
          setIsLoading(false);
        });
      }
    }
  };

  return (
    <>
      <form
        onSubmit={props.handleSubmit}
        className="flex items-center justify-between w-full max-w-5xl p-4 bg-white rounded-xl shadow-xl gap-4"
      >
        <FiPaperclip 
          onClick={handlePaperclipClick}
          color="#CCC" 
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }} // Hide the file input
        />
        <input
          autoFocus
          name="message"
          placeholder="Link or Text"
          className="w-full p-4 rounded-xl shadow-inner flex-1"
          value={props.input}
          onChange={props.handleInputChange}
        />
        <button
          disabled={props.isLoading}
          type="submit"
          className="p-4 text-white rounded-xl shadow-xl bg-gradient-to-r from-cyan-500 to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Enter
        </button>
      </form>
    </>
  );
}
