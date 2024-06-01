import UserForm from "@/components/UserForm";
import prisma from "@/prisma/db";

interface Props {
  params: { id: string };
}

const EditUser = async ({ params }: Props) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!user) {
    return <p className="text-destructive">User Not found</p>;
  }

  user.password = "";
  return <UserForm user={user} />;
};
export default EditUser;
