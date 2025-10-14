"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/providers/AuthProvider";
import { upload } from "@vercel/blob/client";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

const HuggingFaceImageGenerator = () => {
  const [inputValue, setInputValue] = useState("");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImgUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { token, user } = useUser();

  const HF_API_KEY = process.env.HF_API_KEY;

  const generateImage = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setImgUrl("");

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_KEY}`,
      };

      const response = await fetch(
        `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0`,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              negative_prompt: "blurry,bad quality,disorted",
              num_inference_steps: 20,
              guidance_scale: 7.5,
            },
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      const file = new File([blob], "generated.png", { type: "image/png" });
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      console.log(uploaded);
      setImgUrl(uploaded.url);
    } catch (err) {
      setIsLoading(false);
    }
    setIsLoading(false);
  };
  const handleInpuValue = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event?.target.value);
  };
  const createPost = async () => {
    const response = await fetch("http://localhost:8080/posts/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user?._id,
        caption: inputValue,
        images: [imageUrl],
      }),
    });
    if (response.ok) {
      toast("amjilttai");
    } else {
      toast("try again");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          AI Image Generator
        </h1>

        <div className="space-y-8">
          <div>
            <label
              htmlFor="prompt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Describe your image:
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A beautiful sunset over mountains,detailed,vibrant colors..."
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={generateImage}
            disabled={!prompt.trim() || isLoading}
            className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-200 ${
              !prompt.trim() || isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transform hover:scale-105"
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Generating...
              </div>
            ) : (
              "Generate Image"
            )}
          </button>
        </div>
        {isLoading && (
          <div className="mt-8 text-center p-6 bg-purple-50 rounded-lg">
            <div className="text-purple-600 mb-2">Unshij baina</div>
            <div className="text-sm text-purple-500">
              This may take 10-30 seconds
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Your Generated Image:
            </h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <img
                src={imageUrl}
                className="w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        )}
        <Input
          placeholder="write caption"
          onChange={(event) => handleInpuValue(event)}
        />
        <Button onClick={createPost}>Create post</Button>
      </div>
    </div>
  );
};
export default HuggingFaceImageGenerator;
