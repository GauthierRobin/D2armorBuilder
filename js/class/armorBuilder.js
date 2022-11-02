export class ArmorBuilder {
    constructor(statsEnum, armorEnum) {
        this.statsEnum = statsEnum
        this.armorEnum = armorEnum
    }

    generateAllBuild(...args) {
        let allBuild = []
        let max = args.length - 1;

        const helper = (arr, i) => {
            for (let j = 0, l = args[i].length; j < l; j++) {
                let build = arr.slice(0);
                build.push(args[i][j]);

                if (i == max) {
                    allBuild.push(this.generateBuild(build))
                    continue
                }

                helper(build, i + 1);
            }
        }

        helper([], 0);
        return allBuild;
    }

    generateBuild(buildItems) {
        let build = {}
        buildItems.map(item => {
            const bucketType = item.inventory.bucketTypeHash
            build[this.getKeyByProperty(this.armorEnum, bucketType)] = item
        })

        build["buildStats"] = this.sumStats(build)

        return build
    }

    sumStats(buildItems) {
        const buildStats = {}
        for (const armorType in this.armorEnum) {
            const stats = buildItems[armorType].stats

            for (const statType in this.statsEnum) {
                if (statType in buildStats) {
                    buildStats[statType] += stats[this.statsEnum[statType]].value
                    continue
                }

                buildStats[statType] = stats[this.statsEnum[statType]].value
            }
        }

        return buildStats
    }

    getKeyByProperty(obj, value) {
        return Object.keys(obj).find(key => obj[key] === value)
    }

    getBestBuild(allBuild, maxStats = null, maxGeneratedBuild = 5) {
        console.log(maxStats);
        const bestBuild = allBuild.sort(
            (a, b) => {
                return this.average(b, maxStats) - this.average(a, maxStats)
            }
        )

        return bestBuild.slice(0, maxGeneratedBuild)
    }

    average(build, maxStats) {
        let statsSum = 0

        maxStats.forEach(stats => {
            statsSum += build.buildStats[stats]
        })

        return statsSum / maxStats.length
    }

}