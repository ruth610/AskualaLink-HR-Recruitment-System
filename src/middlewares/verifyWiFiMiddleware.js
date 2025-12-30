import dotenv from 'dotenv';
dotenv.config();

export function checkOfficeIP(req, res, next) {
  // Use req.ip (populated by trust proxy)
  let clientIP = req.ip;

  // 1. Normalize
  if (clientIP.startsWith('::ffff:')) {
    clientIP = clientIP.split('::ffff:')[1];
  }
  if (clientIP === '::1') clientIP = '127.0.0.1';

  // 2. Strict Array Parsing
  const rawAllowed = process.env.OFFICE_IP || "";
  // Trim each IP to remove accidental hidden spaces or newlines
  const allowedIPs = rawAllowed.split(',').map(ip => ip.trim());

  console.log(`[Auth Check] Client: ${clientIP} | Allowed: ${allowedIPs}`);

  // 3. Strict Comparison
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