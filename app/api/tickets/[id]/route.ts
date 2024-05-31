import prisma from "@/prisma/db";
import { ticketSchema } from "@/validationSchemas/ticket";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: { id: string };
}

export const PATCH = async (request: NextRequest, { params }: Props) => {
  const body = await request.json();
  const validation = ticketSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.format(), { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  const updatedTicket = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      ...body,
    },
  });

  return NextResponse.json(updatedTicket);
};

export const DELETE = async (request: NextRequest, { params }: Props) => {
  const ticket = await prisma.ticket.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
  }

  await prisma.ticket.delete({ where: { id: ticket.id } });

  return NextResponse.json({ message: "Ticket deleted" });
};