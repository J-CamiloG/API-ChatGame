const User = require("../models/User")
const jwt = require("jsonwebtoken")

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, confirmPassword } = req.body

    // Validar que todos los campos estén presentes
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Por favor complete todos los campos",
      })
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Las contraseñas no coinciden",
      })
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "El correo electrónico ya está registrado",
      })
    }

    // Crear el usuario
    const user = await User.create({
      name,
      email,
      password,
    })

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "30d" })

    // Establecer cookie con el token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    })

    // Responder con los datos del usuario (sin la contraseña)
    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Iniciar sesión de usuario
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validar que se proporcionen email y contraseña
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Por favor, proporcione email y contraseña",
      })
    }

    // Buscar usuario por email
    const user = await User.findOne({ email })

    // Verificar si el usuario existe
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      })
    }

    // Verificar si la contraseña es correcta
    const isMatch = await user.matchPassword(password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      })
    }

    // Actualizar último login
    user.lastLogin = Date.now()
    await user.save()

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "your_jwt_secret", { expiresIn: "30d" })

    // Establecer cookie con el token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 días
    })

    // Responder con los datos del usuario
    res.status(200).json({
      success: true,
      message: "Inicio de sesión exitoso",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        createdAt: user.createdAt,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    // El middleware protect ya añade req.user
    const user = req.user

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        status: user.status,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cerrar sesión
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res, next) => {
  try {
    // Eliminar la cookie del token
    res.clearCookie("token")

    res.status(200).json({
      success: true,
      message: "Sesión cerrada correctamente",
    })
  } catch (error) {
    next(error)
  }
}
