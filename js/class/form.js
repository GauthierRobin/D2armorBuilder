export class Form {
    constructor() { }

    getMaxBuild(maxDefault) {
        const maxBuild = parseInt(document.getElementById("nbOfBuild").value)

        if (isNaN(maxBuild)) {
            return maxDefault
        }

        return maxBuild
    }

    getRarityFilter() {
        const withBasicItem = document.getElementById("withBasic").checked
        return withBasicItem
    }

    getOptiStats(armorStatsEnum) {
        let stats = []

        for (const statsKey in armorStatsEnum) {
            if (document.getElementById(statsKey).checked) {
                stats.push(statsKey)
            }
        }

        if (stats.length < 1) {
            stats = Object.keys(armorStatsEnum)
        }

        return stats
    }
}