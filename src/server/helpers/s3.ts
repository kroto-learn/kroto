import AWS from "aws-sdk";
import { Buffer } from "buffer";
import { env } from "@/env.mjs";

interface ImageUploadResponse {
  location: string;
  key: string;
}

export const imageUpload = async (
  base64: string,
  id: string,
  variant: string
): Promise<string> => {
  // Configure AWS with your access and secret key.
  const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = env;

  // Configure AWS to use promise
  AWS.config.setPromisesDependency(Promise);
  AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });

  // Create an s3 instance
  const s3 = new AWS.S3();

  // Ensure that you POST a base64 data to your server.
  // Let's assume the variable "base64" is one.
  const base64Data = Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // Getting the file type, ie: jpeg, png or gif
  const type = base64?.split(";")[0]?.split("/")[1];

  // Generally we'd have an userId associated with the image
  // For this example, we'll simulate one
  // With this setup, each time your user uploads an image, will be overwritten.
  // To prevent this, use a different Key each time.
  // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
  const params = {
    Bucket: S3_BUCKET,
    Key: `${variant}_${id}.${type ?? ""}`, // type is not required
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64", // required
    ContentType: `image/${type ?? ""}`, // required. Notice the back ticks
  };

  try {
    // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
    // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    const { Location, Key } = await s3.upload(params).promise();
    // Save the Location (url) to your database and Key if needs be.
    const response: ImageUploadResponse = { location: Location, key: Key };
    return response.location;
  } catch (error) {
    console.log(error);
    throw new Error("Image upload failed");
  }
};

export const ogImageUpload = async (
  body: AWS.S3.Body,
  id: string,
  variant: "event" | "creator" | "course"
): Promise<string> => {
  // Configure AWS with your access and secret key.
  const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = env;

  // Configure AWS to use promise
  AWS.config.setPromisesDependency(Promise);
  AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });

  // Create an s3 instance
  const s3 = new AWS.S3();

  // Ensure that you POST a base64 data to your server.
  // Let's assume the variable "base64" is one.

  // Getting the file type, ie: jpeg, png or gif

  // Generally we'd have an userId associated with the image
  // For this example, we'll simulate one
  // With this setup, each time your user uploads an image, will be overwritten.
  // To prevent this, use a different Key each time.
  // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
  const params = {
    Bucket: S3_BUCKET,
    Key: `og_${variant}_${id}.png`,
    Body: body,
    ACL: "public-read",
    ContentType: `image/png`,
  };

  try {
    // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
    // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
    const { Location, Key } = await s3.upload(params).promise();
    // Save the Location (url) to your database and Key if needs be.
    const response: ImageUploadResponse = { location: Location, key: Key };
    return response.location;
  } catch (error) {
    console.log(error);
    throw new Error("Image upload failed");
  }
};

export const deleteS3Image = async ({ key }: { key: string }) => {
  console.log("delete called", key);
  const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION, S3_BUCKET } = env;

  AWS.config.setPromisesDependency(Promise);
  AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });

  const s3 = new AWS.S3();

  const params = {
    Bucket: S3_BUCKET,
    Key: key,
  };

  try {
    await s3.deleteObject(params).promise();
  } catch (err) {
    console.log("Error in deleting image", err);
  }
};
