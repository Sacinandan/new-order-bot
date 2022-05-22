const { SlashCommandStringOption } = require('@discordjs/builders')
const raidBosses = require('../data/rb.json')

/**
 * @param {SlashCommandStringOption} option
 * @param {string} name
 * @param {string} description
 * @param {boolean} required
 * @return SlashCommandStringOption
 */
exports.setRaidBossesOption = (option, name, description, required) => {
    const initialOption = option
      .setName(name)
      .setDescription(description)
      .setRequired(required)

    raidBosses.forEach(boss => initialOption.addChoices({ name: boss.id, value: boss.name }))

    return initialOption
}
