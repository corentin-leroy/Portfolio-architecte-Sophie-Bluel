async function recupererLesTravaux() {
    const reponse = await fetch("http://localhost:5678/api/works")
    const travaux = await reponse.json()
    afficherLesTravaux(travaux)
}

function afficherLesTravaux(travaux) {
    const galerie = document.querySelector(".gallery")
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


recupererLesTravaux()