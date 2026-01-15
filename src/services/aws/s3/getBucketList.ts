import { Bucket, paginateListBuckets, S3Client, S3ServiceException } from "@aws-sdk/client-s3";

export const getBucketList = async () => {
  const client = new S3Client({});
  const buckets: Bucket[] = [];

  try {
    for await (const page of paginateListBuckets({ client }, {})) {
      page.Buckets && buckets.push(...page.Buckets);
    }

    return buckets;
  } catch (caught) {
    if (caught instanceof S3ServiceException) {
      console.error(`${caught.name}: ${caught.message}`);
    } else {
      throw caught;
    }
  }
};
