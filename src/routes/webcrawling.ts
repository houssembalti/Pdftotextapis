import express from "express";

export default (router: express.Router) => {
  router.post("/web", (req, res) => {
    res.send("web");
  });
};
