// utils/ghlApi.js
const axios = require("axios")
const User = require("../models/User")

/**
 * Obtiene un token válido para un usuario, renovándolo si es necesario
 */
async function getValidToken(userId) {
  // Buscar el usuario y su conexión GHL
  const user = await User.findById(userId);
  
  if (!user || !user.ghlConnection) {
    throw new Error('Usuario no tiene conexión con GHL');
  }
  
  // Verificar si el token ha expirado
  const now = new Date();
  const expiresAt = new Date(user.ghlConnection.expiresAt);
  
  // Si el token expira en menos de 5 minutos, renovarlo
  if (expiresAt <= new Date(now.getTime() + 5 * 60 * 1000)) {
    return refreshToken(userId, user.ghlConnection.refreshToken);
  }
  
  return user.ghlConnection.accessToken;
}

/**
 * Renueva un token usando el refresh token
 */
async function refreshToken(userId, refreshToken) {
  try {
    const response = await axios({
      method: 'post',
      url: 'https://services.leadconnectorhq.com/oauth/token',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: new URLSearchParams({
        client_id: process.env.GHL_CLIENT_ID,
        client_secret: process.env.GHL_CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    
    const tokenData = response.data;
    
    // Actualizar los tokens en la base de datos
    await User.findByIdAndUpdate(userId, {
      'ghlConnection.accessToken': tokenData.access_token,
      'ghlConnection.refreshToken': tokenData.refresh_token,
      'ghlConnection.expiresAt': new Date(Date.now() + tokenData.expires_in * 1000),
      'ghlConnection.updatedAt': new Date()
    });
    
    return tokenData.access_token;
  } catch (error) {
    console.error('Error al renovar token:', error);
    
    // Si hay un error al renovar, marcar la conexión como desconectada
    await User.findByIdAndUpdate(userId, {
      'ghlConnection.connected': false,
      'ghlConnection.error': error.message
    });
    
    throw new Error('Error al renovar token de GHL');
  }
}

/**
 * Realiza una petición a la API de GHL
 */
async function callGHLApi(userId, endpoint, method = 'GET', data = null) {
  try {
    const token = await getValidToken(userId);
    
    const response = await axios({
      method,
      url: `https://services.leadconnectorhq.com/${endpoint}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Version': '2021-07-28',
        'Content-Type': 'application/json'
      },
      data: data ? JSON.stringify(data) : undefined
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error en llamada a API GHL (${endpoint}):`, error);
    throw error;
  }
}

module.exports = {
  getValidToken,
  refreshToken,
  callGHLApi
};