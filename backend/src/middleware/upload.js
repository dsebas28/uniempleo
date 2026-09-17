const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const RESUMES_DIR = path.join(__dirname, '..', '..', 'uploads', 'resumes');
if (!fs.existsSync(RESUMES_DIR)) {
  fs.mkdirSync(RESUMES_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, RESUMES_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    cb(null, `cv_${req.user.id}_${Date.now()}_${unique}.pdf`);
  },
});

function pdfFileFilter(req, file, cb) {
  const isPdf = file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf';
  if (!isPdf) {
    return cb(new Error('Solo se permiten archivos en formato PDF'));
  }
  cb(null, true);
}

const uploadResume = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
});

const PHOTOS_DIR = path.join(__dirname, '..', '..', 'uploads', 'photos');
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, PHOTOS_DIR),
  filename: (req, file, cb) => {
    const unique = crypto.randomBytes(8).toString('hex');
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `photo_${req.user.id}_${Date.now()}_${unique}${ext}`);
  },
});

function imageFileFilter(req, file, cb) {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
  const isImage = file.mimetype.startsWith('image/') && allowed.includes(path.extname(file.originalname).toLowerCase());
  if (!isImage) {
    return cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'));
  }
  cb(null, true);
}

const uploadPhoto = multer({
  storage: photoStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3MB máximo
});

module.exports = { uploadResume, uploadPhoto };
