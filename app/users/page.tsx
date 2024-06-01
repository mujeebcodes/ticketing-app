import UserForm from "@/components/UserForm";
import DataTableSimple from "./DataTableSimple";
import prisma from "@/prisma/db";

const Users = async () => {
  const users = await prisma.user.findMany();
  return (
    <div>
      <UserForm />
      <DataTableSimple users={users} />
    </div>
  );
};
export default Users;
