const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  },
  region: process.env.AWS_REGION,
});

const uploadBase64ToS3 = async (base64Image, fileName) => {
  try {
    // Remove the data URL prefix (e.g., "data:image/png;base64,")
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    // Convert to Buffer
    const imageBuffer = Buffer.from(base64Data, "base64");

    // Get the MIME type dynamically
    const fileType = base64Image.match(/^data:(image\/\w+);base64,/)[1];

    // Upload parameters
    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `uploads/${fileName}`,
      Body: imageBuffer,
      ContentType: fileType,
      ACL: "public-read", // Makes it publicly accessible (optional)
    };

    // Upload to S3
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);

    // Return the S3 URL
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw new Error("Failed to upload image to S3");
  }
};

module.exports = {
  uploadBase64ToS3,
};
