export class BuildUi {
    constructor(armorEnum, armorStatsEnum) {
        this.armorEnum = armorEnum
        this.armorStatsEnum = armorStatsEnum
    }

    displayAllBuilds(builds) {
        const container = document.getElementById("builds")

        builds.forEach((build, index) => {
            container.append(this.getHtmlAllItemCard(build))
        })
    }

    getHtmlAllItemCard(build) {
        const div = document.createElement("div")
        div.className = "row text-light w-100 m-auto"

        for (const item in build) {
            if (Object.keys(this.armorEnum).includes(item)) {
                div.append(this.getHtmlItemCard(build[item]))
            }
        }

        return div
    }

    getHtmlItemCard(item) {
        const div = document.createElement("div")
        div.className = "col bg-dark" //mx-1

        div.append(
            this.getHtmlItemHead(`https://www.bungie.net${item.displayProperties.icon}`, item.displayProperties.name),
        )

        for (const statsType in this.armorStatsEnum) {
            div.append(this.getHtmlRowStats(statsType, item.stats[this.armorStatsEnum[statsType]].value))
        }

        return div
    }

    getHtmlItemHead(imgUrl, itemName) {
        const div = document.createElement("div")
        div.className = "row border-bottom border-secondary"

        div.innerHTML = `
                <img class="img-fluid" src="${imgUrl}" alt="">
                <p class="col text-center">${itemName}</p>
            `

        return div
    }

    getHtmlRowStats(statName, stat) {
        const div = document.createElement("div")
        div.className = "row my-2"

        div.innerHTML = `
            <div class="col-1 px-1">
                <img class="img-fluid" src="./assets/${statName}_Icon.png" alt="">
            </div>
            <div class="col bg-secondary px-0 stats"></div>
            <p class="col-2 text-center px-0 m-0">${stat}</p>
        `
        div.querySelector(".stats").style.setProperty("--stat-width", `${stat}%`);

        return div
    }

    getHtmlHeaderstat(statName, stat) {
        const div = document.createElement("div")
        div.className = "col-2 col-sm-1 px-0"

        div.innerHTML = `
            <img class="img-fluid px-md-1 px-lg-2 px-xl-3" src="./assets/${statName}_Icon.png" alt="">
            <p class="text-center">${stat}</p>
        `

        return div
    }

    getHtmlTotalStat(numBuild, totalStat) {
        const div = document.createElement("div")
        div.className = "bg-dark text-light mx-0"
        let allStats = ""

        for (const statName in this.armorStatsEnum) {
            allStats += `
                <div class="col-2 col-sm-1 px-0">
                    <img class="img-fluid px-md-1 px-lg-2 px-xl-3" src="./assets/${statName}_Icon.png" alt="">
                    <p class="text-center">${totalStat[statName]}</p>
                </div>
            `
        }

        div.innerHTML += `
            <h1 class="text-center">Build ${numBuild}</h1>
            <div class="row mx-auto justify-content-center">
                ${allStats}
            </div>
        `

        return div
    }

    createCarroussel(id, builds) {
        const carrousselContainer = document.createElement("div")
        carrousselContainer.id = id
        carrousselContainer.className = "carousel slide"
        carrousselContainer.dataset.ride = "carousel"

        const carroussel = document.createElement("div")
        carroussel.className = "carousel-inner"

        builds.forEach((build, index) => {
            const numBuild = index + 1
            const carrousselItems = document.createElement("div")
            carrousselItems.className = "carousel-item"

            const buildTitle = document.createElement("h3")
            buildTitle.innerHTML = `Build ${numBuild}`

            if (numBuild === 1) {
                carrousselItems.className += " active"
            }

            carrousselItems.append(
                // buildTitle,
                // this.createTotalStats(build),
                this.getHtmlTotalStat(numBuild, build.buildStats),
                this.getHtmlAllItemCard(build)
                // this.getHtmlItemsTable(build)
            )

            carroussel.append(carrousselItems)
        })

        carroussel.innerHTML += `					
            <a class="carousel-control-prev" href="#${id}" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#${id}" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
            </a>`

        carrousselContainer.append(carroussel)
        document.getElementById("builds").append(carrousselContainer)
    }

    show(builds) {
        const buildList = document.createElement("ul")
        buildList.id = "build"

        builds.forEach((build, index) => {
            buildList.append(this.createOne(build, index + 1))
            // console.log(buildList);
        })

        document.getElementById("builds").append(buildList)
    }

    createOne(build, nb) {
        const li = document.createElement("li")

        const numBuild = document.createElement("h3")
        numBuild.innerHTML = `Build ${nb}`

        li.append(
            numBuild,
            this.createTotalStats(build),
            this.getHtmlItemsTable(build)
            // this.createArmorItemHtml(build)
        )

        return li
    }

    createTotalStats(build) {
        const table = document.createElement("table")
        table.innerHTML = `
            <tr>
                <th>Mobilité</th>
                <th>Résistence</th>
                <th>Récupération</th>
                <th>Discipline</th>
                <th>Intelligence</th>
                <th>Force</th>
            </tr>
            <tr>
                <td>${build.buildStats.MOBILITY}</td>
                <td>${build.buildStats.RESILIENCE}</td>
                <td>${build.buildStats.RECOVERY}</td>
                <td>${build.buildStats.DISCIPLINE}</td>
                <td>${build.buildStats.INTELLECT}</td>
                <td>${build.buildStats.STRENGTH}</td>
            </tr>
        `
        return table
    }

    createArmorItemHtml(build) {
        const container = document.createElement("div")

        for (const item in build) {
            if (Object.keys(this.armorEnum).includes(item)) {

                const img = document.createElement("img")
                img.src = `https://www.bungie.net${build[item].displayProperties.icon}`

                container.append(img)
            }
        }

        return container
    }

    getHtmlItemsTable(build) {
        const table = document.createElement("table")
        table.className = "table table-hover table-dark table-responsive text-center"
        let html = this.getItemTableHead()

        for (const itemType in this.armorEnum) {
            html += this.getOneRowItemTable(build[itemType])
        }

        table.innerHTML = html

        return table
    }

    getOneRowItemTable(item) {
        let htmlRowItem = `
            <tr>
                <th scope="row">
                    <img src="https://www.bungie.net${item.displayProperties.icon}" alt="">
                </th>`
        const stats = item.stats

        for (const statsType in this.armorStatsEnum) {
            htmlRowItem += `<td>${stats[this.armorStatsEnum[statsType]].value}</td>`
        }

        return htmlRowItem + "</tr>"
    }

    getItemTableHead() {
        const tableHead = `
        <thead>
            <tr>
                <th scope="col">Icon</th>
                <th scope="col">Mobilité</th>
                <th scope="col">Résistence</th>
                <th scope="col">Récupération</th>
                <th scope="col">Discipline</th>
                <th scope="col">Intelligence</th>
                <th scope="col">Force</th>
            </tr>
        </thead>
        `
        return tableHead
    }
}