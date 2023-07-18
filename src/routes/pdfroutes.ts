import express, { Request, Response, NextFunction } from "express";
//import multer
import multer from "multer";
//import utils
import fs from "fs";
import path from "path";
//pdf2json
const PDFParser = require("pdf2json");
//pdf.js
import {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  getDocument,
} from "pdfjs-dist";
import "pdfjs-dist/build/pd.js";

//pdftotext

import pdf from "pdf-parse";
import { TextItem, TextMarkedContent } from "pdfjs-dist/types/src/display/api";

//multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Image uploaded is not of type pdf "), false);
  }
};
//multer upload
const upload = multer({ storage: storage, fileFilter: fileFilter });
//all pdf routes

export default (router: express.Router) => {
  //pdf2json api
  router.post("/pdf2json", upload.single("pdf"), (req, res) => {
    const pdf = new PDFParser(this, 1);

    const file = req.file;
    console.log(file.filename);
    pdf.on("pdfParser_dataReady", (pdfData: any) => {
      fs.writeFileSync(
        path.join(__dirname, "../pdftexts/pdf2json/", `${file.filename}.txt`),
        pdf.getRawTextContent()
      );
    });
    pdf.loadPDF(req.file.path);
    res.send("done");
    fs.unlinkSync(req.file.path);
  });

  //pdf.js api
  router.post("/pdfjs", upload.single("pdf"), async (req, res) => {
    try {
      let texta: any = await extractTextFromPDF(req.file.path);
      fs.writeFileSync(
        path.join(__dirname, "../pdftexts/pdf.js/", `${req.file.filename}.txt`),
        texta
      );
      res.json({ texta: texta });
      fs.unlinkSync(req.file.path);
    } catch (error) {}
  });
  //pdf-parse api
  router.post('/pdfparse',upload.single('pdf'),(req,res)=>{
 let databuffer= fs.readFileSync(req.file.path);
 pdf(databuffer).then( data=>{
  fs.writeFileSync(
    path.join(__dirname, "../pdftexts/pdfparse/", `${req.file.filename}.txt`),
    data.text
  );
  res.send(data.info);
 })
  })

};
//pdf js async function
async function extractTextFromPDF(pdfFilePath: string) {
  const loadingTask:PDFDocumentLoadingTask = getDocument(pdfFilePath);
  
  const pdf = await loadingTask.promise;
  const textContent = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    
    const page = await pdf.getPage(pageNum);
    const pageText = await page.getTextContent();
    textContent.push(...pageText.items.map((item: TextItem) => item.str));
  }

  return textContent.join(" ");

  //pdf-parse

}
