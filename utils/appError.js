class AppError extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    // si mi error fuera 400 o empezara con 4 ( es un error del cliente), quiero setearlo a error
    //pero si mi estatus empieza con 5 viene del servidor quiero seterarlo a fail
    this.status = `${statusCode}`.startsWith('4') ? 'error' : 'fail';
    //error stack ->
    Error.captureStackTrace(this, this.constructor);
    //  - es un metodo que solicita un argumento un objeto, captura
    //la pila de errores y debuguear mejor, se le pasa this por que apunta hacia la instacia del objeto
  }
}

module.exports = { AppError };
