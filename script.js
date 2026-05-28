const form = document.getElementById("profileForm");
const result = document.getElementById("result");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const bio = document.getElementById("bio").value.trim();
  const imageUrl = document.getElementById("imageUrl").value.trim();

  try {
    const response = await fetch("/profile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, bio, imageUrl })
    });

    const data = await response.json();

    if (!response.ok) {
      result.innerHTML = `<p class="error">${data.message}</p>`;
      return;
    }

    result.innerHTML = data.cardHTML;
    form.reset();
  } catch (error) {
    result.innerHTML = `<p class="error">Server error</p>`;
  }
});