export function sendSuccess(res, status, message, data = null, extra = {}) {
  return res.status(status).json({
    success: true,
    message,
    data,
    ...extra,
  });
}

export function sendError(res, status, message, errors = undefined) {
  const body = {
    success: false,
    message,
  };
  if (errors !== undefined) {
    body.errors = errors;
  }
  return res.status(status).json(body);
}
