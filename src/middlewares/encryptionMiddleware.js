import { decrypt } from "../utils/crypto.js";

export function decryptSensitiveFields(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next();
  }

  const originalJson = res.json.bind(res);

  res.json = (data) => {
    const decryptUser = (user) => {
      if (user.salary) {
        user.salary = decrypt(user.salary);
      }
      if (user.national_id) {
        user.national_id = decrypt(user.national_id);
      }
      return user;
    };

    if (Array.isArray(data)) {
      data = data.map(decryptUser);
    } else if (data?.salary || data?.national_id) {
      data = decryptUser(data);
    }

    return originalJson(data);
  };

  next();
}
