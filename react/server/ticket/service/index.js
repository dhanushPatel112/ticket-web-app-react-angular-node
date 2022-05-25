import client from "@prisma/client"
const { PrismaClient } = client
const prisma = new PrismaClient({ rejectOnNotFound: true })
import httpError from "http-errors"
const { NotAcceptable, NotFound } = httpError
import "dotenv/config"

export async function createService(data) {
	try {
		let ticket = await prisma.ticket.create({
			data: {
				ticket_title: data.ticket_title,
				ticket_desc: data.ticket_desc,
				authorId: data.authorId,
			},
		})
		return ticket
	} catch (error) {
		throw NotAcceptable("Ticket is not created. Try again later..")
	}
}

export async function updateService(id, data) {
	try {
		let ticket = await prisma.ticket.update({
			where: {
				ticket_no: Number(id),
			},
			data: data,
		})
		return ticket
	} catch (error) {
		throw NotAcceptable("Ticket is not updated. Try again later..")
	}
}

export async function deleteTicketService(id) {
	try {
		let ticket = await prisma.ticket.update({
			where: {
				ticket_no: Number(id),
			},
			data: { isDeleted: true },
		})
		return ticket
	} catch (error) {
		throw NotAcceptable("Ticket is not deleted. Try again later..")
	}
}

export async function getAllService({ page, size, sort }) {
	try {
		let ticket = await prisma.ticket.findMany({
			skip: page * size - size,
			take: parseInt(size),
			where: {
				isDeleted: false,
			},
			include: {
				author: true,
			},
			orderBy: [
				{
					ticket_no: sort,
				},
			],
		})
		return ticket
	} catch (error) {
		console.log("Error is \n\n\\n\n\n", error)
		throw NotFound("NO Ticket is available. Try again later..")
	}
}

export async function getByIdService(id) {
	try {
		let ticket = await prisma.ticket.findMany({ where: { ticket_no: Number(id), isDeleted: false } })
		return ticket
	} catch (error) {
		throw NotFound("Ticket is not available. Create and Try again..")
	}
}
