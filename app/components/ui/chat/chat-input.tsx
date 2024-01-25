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
    console.log('handlePaperclipClick called'); // Log when the function is called
    // Trigger the file input click event when the paperclip icon is clicked
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('handleFileChange called'); // Log when the function is called

    if (event.target.files) {
      const file = event.target.files[0];
      console.log('File selected:', file); // Log the selected file

      if (file) {
        setIsLoading(true);
        setError(null);
  
        const formData = new FormData();
        formData.append('file', file);

        console.log('Uploading file'); // Log when the file upload starts
  
        fetch(`${process.env.REACT_APP_SERVER_URL}/api/upload`, {
          method: 'POST',
          body: formData,
        })
        .then(response => {
          console.log('Upload response:', response); // Log the response from the server

          if (!response.ok) {
            console.error('Response:', response);
            throw new Error('File upload failed');
          }
          return response.json();
        })
        .then(data => {
          console.log('Response data:', data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error(error);
          setError('File upload failed');
          setIsLoading(false);
        });
      } else {
        console.error('No file selected');
      }
    } else {
      console.error('No files property on event.target');
    }
  };

  return (
    <>
      <form
        onSubmit={props.handleSubmit}
        className="flex items-center justify-between w-full max-w-5xl p-4 bg-white rounded-xl shadow-xl gap-4"
      >
        <FiPaperclip 
          onClick={(event) => {
            console.log('FiPaperclip onClick event triggered'); // Log when the event is triggered
            handlePaperclipClick();
          }}
          color="#CCC" 
        /> {/* Add the paperclip icon */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={(event) => {
            console.log('File input onChange event triggered'); // Log when the event is triggered
            handleFileChange(event);
          }}
          style={{ display: 'none' }} // Hide the file input
        />
        <input
          autoFocus
          name="message"
          placeholder="Type a message"
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
