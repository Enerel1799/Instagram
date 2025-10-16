"use client";

import { useUser } from "@/providers/AuthProvider";
import { Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "../../_components/Footer";
import { toast } from "sonner";
import { Header } from "../../_components/Header";

type PostType = {
  _id: string;
  caption: string;
  like: string[];
  images: [string];
  user: {
    _id: string;
    username: string;
  };
};

export default function Home() {
  const { token, user } = useUser();
  const { push } = useRouter();

  const [posts, setPosts] = useState<PostType[]>([]);
  const myId = user?._id;

  const fetchPosts = async () => {
    try {
      const res = await fetch("http://localhost:8080/posts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      } else {
        toast.error("Алдаа гарлаа");
      }
    } catch (err) {
      toast.error("Сервертэй холбогдож чадсангүй");
    }
  };

  const postLike = async (postId: string) => {
    try {
      const res = await fetch(`http://localhost:8080/posts/like/${postId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        await fetchPosts();
      }
    } catch {
      toast.error("Like илгээхэд алдаа гарлаа");
    }
  };

  useEffect(() => {
    if (!token) {
      push("/login");
      return;
    }
    fetchPosts();
  }, [token]);

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        paddingBottom: "80px",
        fontFamily: "Helvetica, Arial, sans-serif",
      }}
    >
      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #dbdbdb",
            borderRadius: "4px",
            backgroundColor: "#fff",
            marginBottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                backgroundColor: "#ccc",
                marginRight: "10px",
              }}
            />
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>
              {post._id}
            </span>
          </div>

          {post.images?.[0] && (
            <img
              src={post.images[0]}
              alt="Post"
              style={{
                width: "100%",
                display: "block",
                objectFit: "cover",
              }}
            />
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px",
            }}
          >
            <div
              onClick={() => postLike(post._id)}
              style={{
                cursor: "pointer",
                marginRight: "10px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {post.like?.includes(myId!) ? (
                <Heart fill="red" color="red" />
              ) : (
                <Heart />
              )}
            </div>
            <span style={{ fontWeight: "bold", fontSize: "14px" }}>
              {post.like?.length ?? 0} likes
            </span>
          </div>

          <div
            style={{
              padding: "0 10px 10px",
              fontSize: "14px",
              lineHeight: "1.4",
            }}
          >
            <span style={{ fontWeight: "bold", marginRight: "5px" }}>
              {post._id}
            </span>
            {post.caption}
          </div>
        </div>
      ))}

      <Footer />
    </div>
  );
}
