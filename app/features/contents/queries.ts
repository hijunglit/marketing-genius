import client from "~/supa-client";

export const getContents = async () => {
  const { data, error } = await client.from("contents").select(`
        text,
        images!inner (
            image_url
        ),
        created_at
        `);
  console.log(data, error);
  if (error) throw new Error(error.message);
  return data;
};
