import prisma from "@/lib/prisma";
import CommonSelect from "./CommonSelect";

export default async function UserSelect(props: { defaultValue?: string }) {
  const users = await prisma.user.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return (
    <CommonSelect
      {...props}
      name="authorId"
      label="Author"
      placeholder="Select author"
      defaultValue={props.defaultValue}
      options={users.map((user) => ({
        value: user.id,
        label: user.name ?? user.email,
      }))}
    />
  );
}
