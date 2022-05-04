const raidBosses = require('../data/rb.json')

exports.setRaidBossesOption = (option, name, description, required) => {
    const initialOption = option
        .setName(name)
        .setDescription(description)
        .setRequired(required)

    raidBosses.forEach(boss => initialOption.addChoice(boss.id, boss.name))

    return initialOption
}
