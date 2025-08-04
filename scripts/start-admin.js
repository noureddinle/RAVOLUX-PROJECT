const express = require("express")
const { createAdminServer } = require("../server/admin")

const PORT = process.env.ADMIN_PORT || 3001

async function startAdminServer() {
  try {
    const app = createAdminServer()

    app.listen(PORT, () => {
      console.log(`🚀 AdminJS is running on http://localhost:${PORT}/admin`)
      console.log(`📧 Login with: admin@lightpro.com / admin123`)
    })
  } catch (error) {
    console.error("Failed to start AdminJS server:", error)
    process.exit(1)
  }
}

startAdminServer()
