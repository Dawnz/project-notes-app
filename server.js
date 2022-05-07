var express = require("express");
const mysql = require("mysql");
var app = express();

app.set("view engine", "ejs");

// app.use(express.json);

app.use(
   express.urlencoded({
      extended: true,
   })
);

const conn = mysql.createConnection({
   host: "localhost",
   user: "root",
   password: "",
   database: "assignment1",
   dateStrings: true,
});

conn.connect((err) => {
   if (!err) console.log("Connected to database Successfully");
   else console.log("Connection Failed!" + JSON.stringify(err, undefined, 2));
});

//index page
app.get("/", function (req, res) {
   let mySql = "SELECT * FROM assignment1.projects;";

   conn.query(mySql, (err, results) => {
      if (err) throw err;

      res.render("pages/index", {
         results: results,
      });
   });
});

app.get("/notes", function (req, res) {
   let mySql = "SELECT * FROM assignment1.notes;";

   conn.query(mySql, (err, results) => {
      if (err) throw err;

      res.render("pages/all_notes", {
         notes: results,
      });
   });
});

//project page
app.get("/projects", function (req, res) {
   res.render("pages/projects");
});
app.post("/projects", function (req, res) {
   let data = {
      project_title: req.body.pTitle,
      project_description: req.body.pDesc,
      project_start_dt: req.body.startDate,
      project_due_dt: req.body.dueDate,
   };
   let projectSql = "INSERT INTO assignment1.projects SET ?";

   let query = conn.query(projectSql, data, (err, results) => {
      if (err) throw err;
      res.redirect("/");
   });
});

app.post("/update", function (req, res) {
   const projectId = req.body.projectId;
   let projectSql =
      "UPDATE assignment1.projects SET project_title ='" +
      req.body.pTitle +
      "', project_description ='" +
      req.body.pDesc +
      "', project_start_dt ='" +
      req.body.startDate +
      "', project_due_dt='" +
      req.body.dueDate +
      "' where id =" +
      projectId;

   let query = conn.query(projectSql, (err, results) => {
      if (err) throw err;
      res.redirect("/");
   });
});

app.get("/edit/:projectId", function (req, res) {
   const projectId = req.params.projectId;
   let sql = `Select * from assignment1.projects WHERE id = ${projectId}`;
   let query = conn.query(sql, (err, result) => {
      if (err) throw err;
      // console.log(result[0]);
      res.render("pages/project_edit", {
         project: result[0],
      });
   });
});

app.get("/delete/:projectId", function (req, res) {
   const projectId = req.params.projectId;
   let sql = `DELETE from assignment1.projects WHERE id = ${projectId}`;
   let query = conn.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect("/");
   });
});

app.get("/notes/:projectId", function (req, res) {
   const projectId = req.params.projectId;
   let sql = `Select * from assignment1.notes WHERE project_id = ${projectId}`;
   let query = conn.query(sql, (err, result) => {
      if (err) throw err;
      // console.log(result);
      res.render("pages/notes", {
         notes: result,
         projectId: projectId,
      });
   });
});

//notes modification
app.get("/notes/:projectId/edit/:noteId", function (req, res) {
   const projectId = req.params.projectId;
   const noteId = req.params.noteId;
   let sql = `Select * from assignment1.notes WHERE id = ${noteId}`;
   let query = conn.query(sql, (err, result) => {
      if (err) throw err;
      res.render("pages/notes_edit", {
         notes: result[0],
         projectId: projectId,
         noteId: noteId,
      });
   });
});

app.get("/notes/:projectId/delete/:noteId", function (req, res) {
   const projectId = req.params.projectId;
   const noteId = req.params.noteId;
   let sql = `DELETE from assignment1.notes WHERE id = ${noteId}`;
   let query = conn.query(sql, (err, result) => {
      if (err) throw err;
      res.redirect(`/notes/${projectId}`);
   });
});
//update a note
app.post("/edit-note", function (req, res) {
   const notesId = req.body.notesId;
   const projectId = req.body.projectId;
   let projectSql =
      "UPDATE assignment1.notes SET note ='" +
      req.body.note +
      "', active_date ='" +
      req.body.aDate +
      "' where id =" +
      notesId;

   let query = conn.query(projectSql, (err, results) => {
      if (err) throw err;
      res.redirect(`/notes/${projectId}`);
   });
});
//notes page
app.get("/notes/:projectId/add-note", function (req, res) {
   const projectId = req.params.projectId;
   res.render("pages/add_note", {
      projectId: projectId,
   });
});
//add a new note
app.post("/add-note", function (req, res) {
   let data = {
      project_id: req.body.projectId,
      note: req.body.note,
      active_date: req.body.aDate,
   };
   let projectSql = "INSERT INTO assignment1.notes SET ?";
   console.log(data);

   let query = conn.query(projectSql, data, (err, results) => {
      if (err) throw err;
      res.redirect(`/notes/${data.project_id}`);
   });
});
// app.get("/notes", function (req, res) {
//    res.render("pages/notes");
// });

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));
// conn.end();
