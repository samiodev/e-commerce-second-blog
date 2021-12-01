const { Router } = require("express");
const Notebook = require("../models/notebook");
const router = Router();

router.get("/", async (req, res) => {
  const notebooks = await Notebook.find()
    .populate("userId", "email name")
    .select("price title img descr");
  res.render("notebooks", { title: "Notebooks", isNotebooks: true, notebooks });
});

router.get("/:id/edit", async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }
  const notebook = await Notebook.findById(req.params.id);
  res.render("notebook-edit", {
    title: `Edit ${notebook.title}`,
    notebook,
  });
});

router.post("/edit", async (req, res) => {
  await Notebook.findByIdAndUpdate(req.body.id, req.body);
  res.redirect("/notebooks");
});

router.post("/remove", async (req, res) => {
  try {
    await Notebook.deleteOne({ _id: req.body.id });
    res.redirect("/notebooks");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  const notebook = await Notebook.findById(req.params.id);
  res.render("notebook", {
    layout: "detail",
    title: `Notebook ${notebook.title}`,
    notebook,
  });
});

module.exports = router;
