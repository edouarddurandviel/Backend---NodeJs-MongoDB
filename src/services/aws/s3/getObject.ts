import { GetObjectCommand, NoSuchKey, S3Client, S3ServiceException } from "@aws-sdk/client-s3";
import config from "../../../_config/minio";

export const getObject = async (bucketName: string, key: string) => {
  const client = new S3Client({});
  try {
    const response = await client.send(
      new GetObjectCommand({
        Bucket: config.buckets.test,
        Key: "my-document.jpg"
      })
    );
    if (response.Body) return response.Body.transformToString();
  } catch (caught) {
    if (caught instanceof NoSuchKey) {
      console.error(`No such key from bucket: ${bucketName}`);
    } else if (caught instanceof S3ServiceException) {
      console.error(`${caught.name}: ${caught.message}`);
    } else {
      throw caught;
    }
  }
};
