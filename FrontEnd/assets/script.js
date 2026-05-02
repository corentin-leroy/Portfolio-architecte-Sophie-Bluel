async function recupererLesTravaux() {
    const reponse = await fetch("http://localhost:5678/api/works")
    const travaux = await reponse.json()
    afficherLesTravaux(travaux)
    afficherLesFiltres(travaux)
    afficherGalerieModale(travaux)
}

function afficherLesTravaux(travaux) {
    const galerie = document.querySelector(".gallery")
    galerie.innerHTML = ""

    travaux.forEach(travail => {
        const figure = document.createElement("figure")
        const image = document.createElement("img")
        const legende = document.createElement("figcaption")

        image.src = travail.imageUrl
        image.alt = travail.title
        legende.textContent = travail.title

        figure.appendChild(image)
        figure.appendChild(legende)
        galerie.appendChild(figure)
    })
}

function afficherLesFiltres(travaux) {
    const conteneurFiltres = document.querySelector(".filters")

    const categories = [{ id: 0, name: "Tous" }]
    travaux.forEach(travail => {
        const dejaPresente = categories.some(cat => cat.id === travail.category.id)
        if (!dejaPresente) {
            categories.push(travail.category)
        }
    })

    categories.forEach(categorie => {
        const bouton = document.createElement("button")
        bouton.textContent = categorie.name
        bouton.dataset.id = categorie.id
        if (categorie.id === 0) {
            bouton.classList.add("active")
        }

        // Au clic sur un bouton
        bouton.addEventListener("click", () => {
            // On retire la classe active de tous les boutons
            document.querySelectorAll(".filters button").forEach(btn => {
                btn.classList.remove("active")
            })
            // On l'ajoute sur le bouton cliqué
            bouton.classList.add("active")

            // On filtre les travaux selon la catégorie
            if (categorie.id === 0) {
                afficherLesTravaux(travaux)
            } else {
                const travauxFiltres = travaux.filter(travail => travail.category.id === categorie.id)
                afficherLesTravaux(travauxFiltres)
            }
        })

        conteneurFiltres.appendChild(bouton)
    })
}

function gererModeEdition() {
    const token = localStorage.getItem("token")
    if (!token) return

    // Cacher les filtres
    document.querySelector(".filters").style.display = "none"

    // Login devient Logout
    const lienLogin = document.querySelector("nav li a")
    lienLogin.textContent = "logout"
    lienLogin.addEventListener("click", (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        window.location.reload()
    })

    // Bandeau mode édition
    const bandeau = document.createElement("div")
    bandeau.id = "bandeau-edition"
    bandeau.innerHTML = `
        <p><img src="./assets/icons/edit.png" alt="modifier"> Mode édition</p>
    `
    document.body.prepend(bandeau)

    // Bouton modifier
    const boutonModifier = document.createElement("button")
    boutonModifier.id = "btn-modifier"
    boutonModifier.innerHTML = `<p><img src="./assets/icons/editb.png" alt="modifier"> modifier</p>`
    document.querySelector("#portfolio h2").after(boutonModifier)
}


function gererModale() {
    const overlay = document.querySelector("#overlay")
    const btnFermer = document.querySelector("#btn-fermer-modale")
    const btnAjoutPhoto = document.querySelector("#btn-ajout-photo")
    const btnRetour = document.querySelector("#btn-retour")
    const vueGalerie = document.querySelector("#vue-galerie")
    const vueFormulaire = document.querySelector("#vue-formulaire")
    const btnModifier = document.querySelector("#btn-modifier")

    // Ouvrir la modale au clic sur "modifier"
    btnModifier.addEventListener("click", () => {
        overlay.classList.remove("hidden")
    })

    // Fermer au clic sur la croix
    btnFermer.addEventListener("click", () => {
        overlay.classList.add("hidden")
        vueFormulaire.classList.add("hidden")
        vueGalerie.classList.remove("hidden")
    })

    // Fermer au clic sur l'overlay (en dehors de la modale)
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.add("hidden")
            vueFormulaire.classList.add("hidden")
            vueGalerie.classList.remove("hidden")
        }
    })

    // Passer à la vue formulaire
    btnAjoutPhoto.addEventListener("click", () => {
        vueGalerie.classList.add("hidden")
        vueFormulaire.classList.remove("hidden")
    })

    // Retour à la vue galerie
    btnRetour.addEventListener("click", () => {
        vueFormulaire.classList.add("hidden")
        vueGalerie.classList.remove("hidden")
    })
}

function afficherGalerieModale(travaux) {
    const galerieModale = document.querySelector("#galerie-modale")
    galerieModale.innerHTML = ""

    travaux.forEach(travail => {
        const figure = document.createElement("figure")
        figure.style.position = "relative"

        const image = document.createElement("img")
        image.src = travail.imageUrl
        image.alt = travail.title

        const btnSupprimer = document.createElement("button")
        btnSupprimer.classList.add("btn-supprimer")
        btnSupprimer.innerHTML = `<img src="./assets/icons/delete.svg" alt="supprimer">`

        btnSupprimer.addEventListener("click", async () => {
            const token = localStorage.getItem("token")

            const reponse = await fetch(`http://localhost:5678/api/works/${travail.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })

            if (reponse.ok) {
                figure.remove()
                afficherLesTravaux(await fetch("http://localhost:5678/api/works").then(r => r.json()))
            } else if (reponse.status === 401) {
                localStorage.removeItem("token")
                window.location.reload()
            }
        })

        figure.appendChild(image)
        figure.appendChild(btnSupprimer)
        galerieModale.appendChild(figure)
    })
}

async function remplirCategories() {
    const reponse = await fetch("http://localhost:5678/api/categories")
    const categories = await reponse.json()
    const select = document.querySelector("#categorie-projet")

    categories.forEach(categorie => {
        const option = document.createElement("option")
        option.value = categorie.id
        option.textContent = categorie.name
        select.appendChild(option)
    })
}

function gererFormulaireAjout() {
    const formulaire = document.querySelector("#form-ajout")
    const inputImage = document.querySelector("#input-image")
    const previewImage = document.querySelector("#preview-image")

    inputImage.addEventListener("change", () => {
        const fichier = inputImage.files[0]
        if (fichier) {
            previewImage.src = URL.createObjectURL(fichier)
        }
    })
    formulaire.addEventListener("submit", async (event) => {
        event.preventDefault()

        const token = localStorage.getItem("token")
        const titre = document.querySelector("#titre-projet").value
        const categorie = document.querySelector("#categorie-projet").value
        const image = document.querySelector("#input-image").files[0]

        // Vérification que tous les champs sont remplis
        if (!titre || !categorie || !image) {
            alert("Veuillez remplir tous les champs")
            return
        }

        // Construction du FormData
        const formData = new FormData()
        formData.append("title", titre)
        formData.append("category", categorie)
        formData.append("image", image)

        const reponse = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        })

        if (reponse.ok) {
        const nouveauTravail = await reponse.json()

        // Ajouter dans la galerie principale
        const galerie = document.querySelector(".gallery")
        const figure = document.createElement("figure")
        const image = document.createElement("img")
        const legende = document.createElement("figcaption")

        image.src = nouveauTravail.imageUrl
        image.alt = nouveauTravail.title
        legende.textContent = nouveauTravail.title

        figure.appendChild(image)
        figure.appendChild(legende)
        galerie.appendChild(figure)

        // Ajouter dans la galerie de la modale
        const galerieModale = document.querySelector("#galerie-modale")
        const figureModale = document.createElement("figure")
        figureModale.style.position = "relative"

        const imageModale = document.createElement("img")
        imageModale.src = nouveauTravail.imageUrl
        imageModale.alt = nouveauTravail.title

        const btnSupprimer = document.createElement("button")
        btnSupprimer.classList.add("btn-supprimer")
        btnSupprimer.textContent = "🗑"

        btnSupprimer.addEventListener("click", async () => {
            const token = localStorage.getItem("token")
            const reponse = await fetch(`http://localhost:5678/api/works/${nouveauTravail.id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            })
            if (reponse.ok) {
                figureModale.remove()
                afficherLesTravaux(await fetch("http://localhost:5678/api/works").then(r => r.json()))
            }
        })

        figureModale.appendChild(imageModale)
        figureModale.appendChild(btnSupprimer)
        galerieModale.appendChild(figureModale)

        // Réinitialiser le formulaire
        formulaire.reset()
         previewImage.src = "./assets/icons/image-placeholder.svg"
        } 
    })     
}          

recupererLesTravaux()
gererModeEdition()
gererModale()
remplirCategories()
gererFormulaireAjout()