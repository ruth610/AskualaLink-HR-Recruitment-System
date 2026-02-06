import multer  from "multer";
import fs from 'fs';


const uploadsDir = '.uploads/resumes'

if(!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir,{recursive: true});
};

const storage = multer.diskStorage({
    destination :(req,file,cb)=>{
        cb(null, uploadsDir);
    },
    filename: (req,res,cb)=>{
        const sanitizedName = file.originalname.replace(/\s+/g, '-').toLowerCase();
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

        cb(null,`${uniqueSuffix}-${sanitizedName}`);
    }
});

const fileFilter = (req,file,cb) =>{
    const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]

    if(allowedTypes.includes(file.mimetype)){
        cb(null,true);
    }
    else{
        cb( new Error("Only .pdf, .doc and .docx formats allowed!"), false);
    }
};

export const uploads = multer({
    storage:storage,
    fileFilter:fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
})



