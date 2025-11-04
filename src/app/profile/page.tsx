"use client";

import { User, useUser } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import { PostType } from "../page";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";

const Page = () => {
    const {user,token} = useUser();    
    const [userInfo,setUserInfo]= useState<User | null>();
    const [posts, setPosts] = useState<PostType[]>([])
      const [loading, setLoading] = useState(true);

  
    const userId = user?._id;
    const fetchUserData= async()=>{
      const response = await fetch(`https://ig-backend-a8gz.onrender.com/user-info/${userId}`,{
        headers:{
          authorization : `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
  
      const user = await response.json()
      setUserInfo(user)
    }

  const fetchPosts = async () => {
      const res = await fetch(`https://ig-backend-a8gz.onrender.com/posts/user-posts/${userId}`, {
        headers: { authorization: `Bearer ${token}` ,
        "Content-Type": "application/json"
      },
      });
      if (res.ok){     
        const posts = await res.json();
        setPosts(posts);
      }else{
        toast.error("aldaa")
    }

  };
  
  useEffect(() => {
    if (token) {
      (async () => {
        setLoading(true);
        await Promise.all([fetchUserData(), fetchPosts()]);
        setLoading(false);
      })();
    }
  }, [token]);

    if (loading) return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
    return (
    <div
      style={{
        maxWidth: "935px",
        margin: "0 auto",
        padding: "30px 20px",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "100px",
          marginBottom: "44px",
        }}
      >
        <div
          style={{
            width: "150px",
            height: "150px",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "#ccc",
            flexShrink: 0,
          }}
        >
          {userInfo?.profilePicture ? (
            <img
              src={userInfo.profilePicture}
              alt="Profile"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ) : null}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <h2 style={{ fontWeight: 400, fontSize: "28px", margin: 0 }}>
              {userInfo?.username}
            </h2>
          </div>

          <ul
            style={{
              display: "flex",
              gap: "40px",
              margin: 0,
              padding: 0,
              listStyle: "none",
              fontSize: "16px",
            }}
          >
            <li>
              <strong>{posts.length}</strong> posts
            </li>
            <li>
              <strong>{userInfo?.followers?.length ?? 0}</strong> followers
            </li>
            <li>
              <strong>{userInfo?.following?.length ?? 0}</strong> following
            </li>
          </ul>
          <div style={{ marginTop: "20px" }}>
            <p style={{ marginTop: "5px", fontSize: "14px", color: "#333" }}>
              {userInfo?.bio}
            </p>
          </div>
        </div>
      </div>

      <hr style={{ border: "none", borderTop: "1px solid #dbdbdb", marginBottom: "30px" }} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(293px, 1fr))",
          gap: "3px",
        }}
      >
        {posts.map((post) => (
          <div
            key={post._id}
            style={{
              position: "relative",
              aspectRatio: "1 / 1",
              overflow: "hidden",
              backgroundColor: "#000",
            }}
          >
            <img
              src={
                Array.isArray(post.images)
                  ? post.images[0]
                  : post.images
              }
              alt="Post"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Page;
