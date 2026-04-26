// Upload image to ImgBB and return the URL
export async function uploadImageToImgBB(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(
    `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await response.json();

  if (!data.success) {
    throw new Error("Failed to upload image");
  }

  return data.data.display_url;
}
