import dotenv from 'dotenv';
dotenv.config();

export function checkOfficeIP(req, res, next) {
  let clientIP = req.ip;

  if (clientIP.startsWith('::ffff:')) {
    clientIP = clientIP.split('::ffff:')[1];
  }
  if (clientIP === '::1') clientIP = '127.0.0.1';

  const rawAllowed = process.env.OFFICE_IP || "";
  const allowedIPs = rawAllowed.split(',').map(ip => ip.trim());

  console.log(`[Auth Check] Client: ${clientIP} | Allowed: ${allowedIPs}`);

  const isAllowed = allowedIPs.includes(clientIP);

  if (!isAllowed) {
    console.warn(`[SECURITY] Blocked unauthorized IP: ${clientIP}`);
    return res.status(403).json({
      success: false,
      message: 'Access restricted to office network'
    });
  }

  next();
}