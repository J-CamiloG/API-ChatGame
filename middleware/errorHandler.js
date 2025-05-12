const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Errores de Mongoose
    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
        success: false,
        message: messages.join(', ')
        });
    }

    // Error de clave duplicada (email ya existe)
    if (err.code === 11000) {
        return res.status(400).json({
        success: false,
        message: 'El correo electrónico ya está registrado'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Error del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
};

module.exports = errorHandler;