import prisma from "@/prisma/db";
import { userSchema } from "@/validationSchemas/users";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import options from "../../auth/[...nextauth]/options";

interface Props {
  params: { id: string };
}

export const PATCH = async (request: NextRequest, { params }: Props) => {
  const session = await getServerSession(options);

  if (!session) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Not an Admin" }, { status: 401 });
  }
  const body = await request.json();
  const validation = userSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (body?.password && body.password != "") {
    const hashedPassword = await bcrypt.hash(body.password, 10);
    body.password = hashedPassword;
  } else {
    delete body.password;
  }

  if (user.username !== body.username) {
    const userNameExists = await prisma.user.findUnique({
      where: { username: body.username },
    });

    if (userNameExists) {
      return NextResponse.json(
        { message: "Username already exists" },
        { status: 409 }
      );
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { ...body },
  });

  return NextResponse.json(updatedUser);
};
