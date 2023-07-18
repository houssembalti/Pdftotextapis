import express from "express";
const router = express.Router();
import pdfroutes from "./pdfroutes";
import excel from "./webcrawling";
export default (): express.Router => {
  pdfroutes(router);
  excel(router);
  return router;
};
