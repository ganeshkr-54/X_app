import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';


function CommentInputCard({ commentHandler, postDetails }) {
    console.log(postDetails)
    const [commentText, setCommentText] = useState("");

    function onChange(e) {
        setCommentText(e.target.value); // Update the state with the input value
    }

    async function onSubmit(e) {
        e.preventDefault(); // Prevent page reload on form submission
        if (commentText.trim() === "") {    // check if the user keeps empty field (only whitespaces)
            alert("Comment cannot be empty");
            return;
        }
        await commentHandler(commentText);
        setCommentText(""); // Clear the input after submission
    }

    return (
        <div className="comment-input-card flex justify-center mx-5 ml-14 m-4 ">
            <form onSubmit={onSubmit} className="flex gap-2 w-full max-w-xl">
                <input
                    type="text"
                    name="comment"
                    id="comment"
                    placeholder={`Add a comment for ${postDetails.user.name}`}
                    value={commentText}
                    onChange={onChange}
                    className="border p-2 rounded flex-1"
                />
                <button
                    type="submit"
                    className=" bg-blue-500 text-white p-2 px-4 rounded"
                    disabled={commentText.trim() === ""}
                >
                    <Send />
                </button>
            </form>
        </div>
    );
}

export default CommentInputCard;
