import dotenv from 'dotenv';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../src/utils/swagger/swagger.js';
import * as authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/auth', authRoutes.router);

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. Max limit is 5MB.'
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  }

  if (err.message === "Only .pdf, .doc and .docx formats allowed!") {
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }

  return res.status(500).json({ success: false, message: 'Internal Server Error'});
});

export default app;