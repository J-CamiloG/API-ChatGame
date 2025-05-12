const jwt = require("jsonwebtoken")
const User = require("../models/User")

/**
 * Middleware para proteger rutas que requieren autenticación
 * Verifica el token JWT y añade el usuario a req.user
 */
const protect = async (req, res, next) => {
  let token

  // Verificar si hay token en las cookies o en el header Authorization
  if (req.cookies.token) {
    token = req.cookies.token
  } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]
  }

  // Si no hay token, devolver error
  if (!token) {
    return res.status(401).json({ message: "No autorizado, no hay token" })
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret")

    // Buscar usuario por id y añadirlo a req.user
    req.user = await User.findById(decoded.id).select("-password")

    if (!req.user) {
      return res.status(401).json({ message: "Usuario no encontrado" })
    }

    next()
  } catch (error) {
    console.error("Error en middleware de autenticación:", error)
    return res.status(401).json({ message: "No autorizado, token inválido" })
  }
}

module.exports = { protect }
