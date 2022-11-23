export class BungieApi {
    constructor(apiKey, armorEnum) {
        this.apiKey = apiKey
        this.urlParams = new URLSearchParams(window.location.search)
        this.armorEnum = armorEnum
        this.setCode()
    }

    setCode() {
        localStorage.setItem("auth_code", this.urlParams.get("code"))
    }

    async getToken() {
        try {
            const options = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                    "X-API-Key": this.apiKey,
                    "Origin": window.location.origin
                },
                mode: "cors",
                body: `grant_type=authorization_code&code=${localStorage.getItem("auth_code")}&client_id=41807`
            }

            const url = "https://www.bungie.net/platform/app/oauth/token/"
            const res = await fetch(url, options)
            const data = await res.json()
            console.log(data);
            localStorage.setItem("access_token", data.access_token)
            localStorage.setItem("member_id", data.membership_id)
        } catch (error) {
            console.log(">>> error while get token", error);
        }
    }

    async getMembershipsFromUser() {
        try {
            const options = {
                method: "GET",
                headers: {
                    "X-API-Key": this.apiKey,
                    "Origin": window.location.origin,
                    "authorization": `Bearer ${localStorage.getItem("access_token")}`
                },
                mode: "cors"
            }

            const url = "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/"
            const res = await fetch(url, options)

            if (res.status !== 200) {
                return res
            }

            const data = await res.json()
            const destinyMember = data.Response.destinyMemberships
            localStorage.setItem("membership_id", destinyMember[0].membershipId)
            localStorage.setItem("membership_type", destinyMember[0].membershipType)

            return data
        } catch (error) {
            console.log(">>> error while get Memberships from current user", error);
        }
    }

    async getInventoryDatas() {
        try {
            const options = {
                method: "GET",
                headers: {
                    "Origin": window.location.origin,
                    "X-API-Key": this.apiKey,
                    "authorization": `Bearer ${localStorage.getItem("access_token")}`
                }
            }

            const url = `https://www.bungie.net/Platform/Destiny2/${localStorage.getItem("membership_type")}/Profile/${localStorage.getItem("membership_id")}/?components=102%2C304%2C300%2C205%2C201`
            const res = await fetch(url, options)
            const data = await res.json()

            return {
                itemsInstance: data.Response.itemComponents.instances.data,
                itemsStats: data.Response.itemComponents.stats.data,
                inventory: data.Response.profileInventory.data.items,
                charEquipement: data.Response.characterEquipment.data,
                charInventory: data.Response.characterInventories.data
            }
        } catch (error) {
            // console.log(error)
            if (error.message === `Unexpected token '<', "<!DOCTYPE "... is not valid JSON`) {
                await this.getToken()
                // await this.getInventoryDatas()
            }
        }
    }

    async getInventoryManifest() {
        try {
            const options = {
                method: "GET",
            }

            const url = "https://www.bungie.net/common/destiny2_content/json/fr/DestinyInventoryItemDefinition-c56f2be5-410b-451d-b7d0-11d545b0c376.json" //`https://www.bungie.net/common/destiny2_content/json/fr/DestinyInventoryItemDefinition-1b303207-5a14-4260-afb1-591ae61e113f.json`
            const res = await fetch(url, options)
            const manifest = await res.json()
            return manifest
        } catch (error) {
            console.log(">>> error while get inventory", error);
        }
    }



    mergeDatas(itemInstance, itemsStats, manifest, ...items) {
        let merged = {}
        let allitems = items.flat()

        for (const key in itemInstance) {
            const inventoryItem = allitems.find(param => param.itemInstanceId === key)

            if (typeof inventoryItem === "undefined") {
                continue
            }

            merged[key] = Object.assign(
                inventoryItem,
                manifest[inventoryItem.itemHash],
                itemInstance[key],
                itemsStats[key],
            )
        }

        return merged
    }

    async getInventory() {
        // await this.getToken()
        const manifest = await this.getInventoryManifest()
        const { itemsInstance, itemsStats, inventory, charEquipement, charInventory } = await this.getInventoryDatas()

        return this.mergeDatas(
            itemsInstance,
            itemsStats,
            manifest,
            inventory,
            Object.values(charEquipement)[0].items,
            Object.values(charInventory)[0].items
        )
    }

    async getArmorByCategory() {
        let armors = { HELMET: [], GAUNTLET: [], CHEST_ARMOR: [], LEG_ARMOR: [] }
        const inventory = await this.getInventory()

        for (const itemInstance in inventory) {
            const bucketType = inventory[itemInstance].inventory.bucketTypeHash

            if (this.objHasValue(this.armorEnum, bucketType)) {
                const armorType = this.getKeyByProperty(this.armorEnum, bucketType)
                armors[armorType].push(inventory[itemInstance])
            }
        }

        return armors
    }

    getKeyByProperty(obj, value) {
        return Object.keys(obj).find(key => obj[key] === value)
    }

    objHasValue(obj, value) {
        return Object.values(obj).includes(value)
    }
}
