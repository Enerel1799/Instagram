"use client";

import { useUser } from "@/providers/AuthProvider";

const Page = () => {
  const { token, user } = useUser();
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            backgroundColor: "#ccc",
            marginRight: "30px",
          }}
        />

        <div>
          <h2 style={{ margin: "0 0 10px", fontSize: "24px" }}>
            {user?.username}
          </h2>
          <div style={{ fontSize: "14px", color: "#888" }}>{user?.email}</div>
          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "15px",
              fontSize: "14px",
            }}
          >
            <span>
              <strong>{user?.followers.length}</strong> followers
            </span>
            <span>
              <strong>{user?.following.length}</strong> following
            </span>
          </div>
        </div>
      </div>

      <hr style={{ borderColor: "#dbdbdb", margin: "20px 0" }} />
      <span>{user?.bio}</span>

      <div style={{ fontSize: "14px", color: "#444" }}></div>
    </div>
  );
};
export default Page;
