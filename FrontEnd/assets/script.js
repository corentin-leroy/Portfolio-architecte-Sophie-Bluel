async function recupererLesTravaux() {
    const reponse = await fetch("http://localhost:5678/api/works")
    const travaux = await reponse.json()
    afficherLesTravaux(travaux)
    afficherLesFiltres(travaux)
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

recupererLesTravaux()