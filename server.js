const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve html, css, js from the same folder
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/profile", (req, res) => {
  const { name, bio, imageUrl } = req.body;

  if (!name || !bio || !imageUrl) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const cardHTML = `
    <div class="profile-card">
      <img src="${imageUrl}" alt="${name}" class="profile-image">
      <h2>${name}</h2>
      <p>${bio}</p>
    </div>
  `;

  res.json({ cardHTML });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});