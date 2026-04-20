const formulaire = document.querySelector("#login-form")

formulaire.addEventListener("submit", async (event) => {
    event.preventDefault()

    const email = document.querySelector("#email").value
    const password = document.querySelector("#password").value

    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
    })

    if (reponse.ok) {
        const donnees = await reponse.json()
        localStorage.setItem("token", donnees.token)
        window.location.href = "index.html"
    } else {
        const erreur = document.querySelector("#erreur")
        erreur.textContent = "Identifiants incorrects"
        erreur.style.height = "auto"
    }
})