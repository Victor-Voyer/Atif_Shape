import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

if(!PORT) {
    console.error('PORT missing in environment variables');
    process.exit(1);
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});