const express = require("express")
const router = express.Router()
const { registerUser, loginUser, getMe, logout } = require("../controllers/authController")
const { protect } = require("../middleware/auth")

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: ID único generado por MongoDB
 *         name:
 *           type: string
 *           description: Nombre completo del usuario
 *         email:
 *           type: string
 *           description: Correo electrónico del usuario (único)
 *         username:
 *           type: string
 *           description: Nombre de usuario generado a partir del email
 *         password:
 *           type: string
 *           description: Contraseña encriptada del usuario
 *         status:
 *           type: string
 *           description: Estado de la cuenta (active, inactive, suspended)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación de la cuenta
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Fecha de última actualización de la cuenta
 *       example:
 *         _id: 60d21b4667d0d8992e610c85
 *         name: Juan Pérez
 *         email: juan@example.com
 *         username: juan
 *         status: active
 *         createdAt: 2023-01-01T00:00:00.000Z
 *         updatedAt: 2023-01-01T00:00:00.000Z
 */

/**
 * @swagger
 * tags:
 *   name: Autenticación
 *   description: API para gestión de autenticación de usuarios
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre completo del usuario
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario (mínimo 6 caracteres)
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 description: Confirmación de la contraseña
 *             example:
 *               name: Juan Pérez
 *               email: juan@example.com
 *               password: password123
 *               confirmPassword: password123
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Usuario registrado exitosamente
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: Juan Pérez
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     status:
 *                       type: string
 *                       example: active
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.post("/register", registerUser)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del usuario
 *             example:
 *               email: juan@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Inicio de sesión exitoso
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: Juan Pérez
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     status:
 *                       type: string
 *                       example: active
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.post("/login", loginUser)

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtiene la información del usuario autenticado
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 60d21b4667d0d8992e610c85
 *                     name:
 *                       type: string
 *                       example: Juan Pérez
 *                     email:
 *                       type: string
 *                       example: juan@example.com
 *                     username:
 *                       type: string
 *                       example: juan
 *                     status:
 *                       type: string
 *                       example: active
 */
router.get("/me", protect, getMe)

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra la sesión del usuario
 *     tags: [Autenticación]
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Sesión cerrada correctamente
 */
router.post("/logout", logout)

/**
 * @swagger
 * /api/auth/ghl-callback:
 *   get:
 *     summary: Callback para OAuth de Go High Level
 *     description: Endpoint que recibe el código de autorización de GHL y lo intercambia por tokens
 *     tags: [Autenticación]
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         required: true
 *         description: Código de autorización proporcionado por GHL
 *       - in: query
 *         name: locationId
 *         schema:
 *           type: string
 *         description: ID de la ubicación seleccionada en GHL
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *         description: ID de la compañía en GHL
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: Estado para validar la solicitud y contiene el userId codificado
 *     responses:
 *       302:
 *         description: Redirección al frontend con estado de éxito o error
 */
router.get("/ghl-callback", async (req, res) => {
  try {
    // 1. Obtener el código y otros parámetros de la URL
    const { code, locationId, companyId, state } = req.query;
    
    // Verificar que tenemos un código
    if (!code) {
      console.error('No se recibió código de autorización');
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=no_code`);
    }
    
    // 2. Intercambiar el código por tokens
    const tokenResponse = await axios({
      method: 'post',
      url: 'https://services.leadconnectorhq.com/oauth/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        client_id: process.env.GHL_CLIENT_ID,
        client_secret: process.env.GHL_CLIENT_SECRET,
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.API_URL}/api/auth/ghl-callback`,
      }),
    });
    
    // Verificar la respuesta
    if (!tokenResponse.data || !tokenResponse.data.access_token) {
      console.error('Error al obtener tokens:', tokenResponse.data);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=token_exchange`);
    }
    
    const tokenData = tokenResponse.data;
    
    // 3. Extraer el userId del state o de cookies/sesión
    // Opción 1: Si pasaste el userId en el state (recomendado)
    let userId;
    try {
      // El state podría ser un JSON codificado en base64
      const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
      userId = decodedState.userId;
    } catch (error) {
      console.error('Error al decodificar state:', error);
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=invalid_state`);
    }
    
    if (!userId) {
      console.error('No se pudo identificar al usuario');
      return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=user_not_found`);
    }
    
    // 4. Guardar los tokens en la base de datos
    await User.findByIdAndUpdate(userId, {
      ghlConnection: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000),
        locationId,
        companyId,
        connected: true,
        updatedAt: new Date()
      }
    });
    
    console.log(`Conexión GHL establecida para el usuario ${userId}`);
    
    // 5. Redirigir al usuario al frontend con un mensaje de éxito
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?connected=true&provider=ghl`);
    
  } catch (error) {
    console.error('Error en el callback de OAuth:', error);
    return res.redirect(`${process.env.FRONTEND_URL}/dashboard?error=server_error&message=${encodeURIComponent(error.message)}`);
  }
});

/**
 * @swagger
 * /api/auth/ghl-status:
 *   get:
 *     summary: Verifica el estado de la conexión con GHL
 *     description: Comprueba si el usuario tiene una conexión activa con Go High Level
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado de la conexión
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 connected:
 *                   type: boolean
 *                   example: true
 *                 isExpired:
 *                   type: boolean
 *                   example: false
 *                 locationId:
 *                   type: string
 *                   example: "123456"
 *                 companyId:
 *                   type: string
 *                   example: "789012"
 */
router.get("/ghl-status", protect, async (req, res) => {
  try {
    const userId = req.user.id; // Asumiendo que tu middleware protect añade req.user
    
    const user = await User.findById(userId);
    if (!user || !user.ghlConnection || !user.ghlConnection.connected) {
      return res.json({ connected: false });
    }
    
    // Verificar si el token ha expirado
    const isExpired = new Date() > new Date(user.ghlConnection.expiresAt);
    
    return res.json({
      connected: true,
      isExpired,
      locationId: user.ghlConnection.locationId,
      companyId: user.ghlConnection.companyId
    });
  } catch (error) {
    console.error('Error al verificar estado de GHL:', error);
    return res.status(500).json({ error: 'Error al verificar estado de conexión' });
  }
});

/**
 * @swagger
 * /api/auth/ghl-disconnect:
 *   post:
 *     summary: Desconecta la cuenta de GHL
 *     description: Elimina la conexión con Go High Level para el usuario actual
 *     tags: [Autenticación]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conexión eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Conexión con GHL eliminada correctamente
 */
router.post("/ghl-disconnect", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    
    await User.findByIdAndUpdate(userId, {
      $unset: { ghlConnection: 1 }
    });
    
    return res.json({ 
      success: true, 
      message: 'Conexión con GHL eliminada correctamente' 
    });
  } catch (error) {
    console.error('Error al desconectar GHL:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Error al desconectar GHL' 
    });
  }
});

module.exports = router
