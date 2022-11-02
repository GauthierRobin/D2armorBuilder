import { BungieApi } from "./class/bungieApi.js"
import { ArmorBuilder } from "./class/armorBuilder.js"
import { armorEnum, armorStatsEnum, armorTierTypeEnum } from "../config/bungieEnum.js"
import { InfosUi } from "./class/ui/infosUi.js"
import { Form } from "./class/form.js"
import { BuildUi } from "./class/ui/buildUi.js"

const api = new BungieApi("9971692b4fd74ca2b844b11ec6cdf7ef", armorEnum)
const armorBuilder = new ArmorBuilder(armorStatsEnum, armorEnum)
const infosUi = new InfosUi()
const form = new Form()
const buildUi = new BuildUi(armorEnum, armorStatsEnum)

const init = async () => {
    await api.setCode()
    const memberRes = await api.getMembershipsFromUser()

    if (memberRes.status !== 200) {
        await api.getToken()
        await api.getMembershipsFromUser()
    }
}

init()

const filter = (AllArmor, armorTierType) => {
    console.log("filtrage en cour ...");
    for (const armorType in AllArmor) {
        AllArmor[armorType] = AllArmor[armorType].filter((armor) => {
            return Object.values(armorTierType).includes(armor.inventory.tierType)
        })
    }

    return AllArmor
}

document.getElementById("buildArmor").addEventListener("submit", async (e) => {
    e.preventDefault()

    infosUi.clearElement("infos")
    infosUi.clearElement("builds")

    const withBasicItem = form.getRarityFilter()
    const nbOfBuild = form.getMaxBuild(5)
    const optiStats = form.getOptiStats(armorStatsEnum)

    infosUi.showInfo("Génération des build ...")

    let allArmors = await api.getArmorByCategory()

    if (!withBasicItem) {
        // infosUi.showInfo("Filtrage des armures ...")
        allArmors = filter(allArmors, armorTierTypeEnum)
    }

    // infosUi.showInfo("Création des meilleures build ...")

    const allBuild = armorBuilder.generateAllBuild(
        allArmors.HELMET,
        allArmors.GAUNTLET,
        allArmors.CHEST_ARMOR,
        allArmors.LEG_ARMOR
    )

    infosUi.showInfo(`${allBuild.length} build généré !`)

    const bestBuild = armorBuilder.getBestBuild(allBuild, optiStats, nbOfBuild)
    console.log(bestBuild);

    // buildUi.show(bestBuild)
    buildUi.createCarroussel("buildsCarroussel", bestBuild)
    // buildUi.displayAllBuilds(bestBuild)
})