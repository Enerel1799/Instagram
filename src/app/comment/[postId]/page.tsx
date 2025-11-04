"use client";

import { useUser } from "@/providers/AuthProvider";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type CommentType = {    
  _id: string;
  user: {
    _id: string
    username: string
  }
  comment: string;
  post: {
    _id: string
    caption: string
  }
};

const Page = () => {
  const [comments, setComments] = useState<CommentType[]| null>(null);
  const { token } = useUser();
  const params = useParams();
  const postId = params.postId;

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8080/comment/get/${postId}`, {
        method: "GET",
        headers: {         
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const fetchedComments = await response.json();
        setComments(fetchedComments);
      } else {
        toast.error("Failed to fetch comments");
      }
    } catch (error) {
      toast.error("An error occurred while fetching comments");
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) fetchComments();
  }, [token]);

  return (
    <div>
      <h2>Comments:</h2>
      <div>
        {comments?.length === 0 ? (
          <div>No comments</div> 
        ) : (
          comments?.map((comment) => (
            <div key={comment?._id} className="border-b py-2">
              <p>{comment.comment}</p>
              <small>— {comment?.user?.username}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Page;
