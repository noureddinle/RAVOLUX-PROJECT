import { type NextRequest, NextResponse } from "next/server"
import { createAdminServer } from "../../../server/admin"

// Create AdminJS server instance
const adminApp = createAdminServer()

export async function GET(request: NextRequest) {
  return new NextResponse("AdminJS is running on /admin", { status: 200 })
}

export async function POST(request: NextRequest) {
  return new NextResponse("AdminJS POST handler", { status: 200 })
}
