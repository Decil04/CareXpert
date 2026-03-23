import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 3001;

app.listen(PORT as number, '0.0.0.0', () => {
  console.log(`[CareXpert Server] Running at http://localhost:${PORT}`);
  console.log(`[CareXpert Server] Bound to 0.0.0.0 (Accessible from external Wi-Fi devices)`);
  console.log(`[Environment] ${process.env.NODE_ENV || 'development'}`);
});
