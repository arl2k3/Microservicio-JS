const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
  
    const statusCode = err.status || 500;
    let message;
    let response;
  
    switch (statusCode) {
      case 400:
        message = err.message || "Solicitud incorrecta";
        response = err.response || `Datos inválidos: ${JSON.stringify(req.body)}`;
        break;
      case 401:
        message = err.message || "No autorizado";
        response = err.response || "Error de autorización";
        break;
      case 403:
        message = err.message || "Prohibido";
        response = err.response || "Acceso denegado";
        break;
      case 404:
        message = err.message || "Recurso no encontrado";
        response = err.response || `Ruta no encontrada: ${req.originalUrl}`;
        break;
      case 422:
        message = err.message || "Error de validacion";
        response = err.response || "Datos no cumplen con la validacion requerida";
        break;
      default:
        message = err.message || "Error interno del servidor";
        response = err.response || "Error inesperado";
        break;
    }
  
    res.status(statusCode).json({
      status: statusCode,
      message,
      response,
    });
  };
  
  // Middleware para manejar rutas no encontradas
  const notFoundHandler = (req, res, next) => {
    res.status(404).json({
      status: 404,
      message: "Ruta no encontrada",
      response: `La ruta ${req.originalUrl} no existe en este servidor.`,
    });
  };
  
  // Middleware para manejar JSON mal formateado
  const malformedJsonHandler = (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({
        status: 400,
        message: "JSON mal formado",
        response: "El cuerpo de la solicitud contiene un JSON inválido.",
      });
    }
    next(err);
  };
  
  module.exports = {
    errorHandler,
    notFoundHandler,
    malformedJsonHandler,
  };
  