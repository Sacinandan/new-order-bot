const config = require('../config.json')

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    try {
      const role = member.guild.roles.cache.find(r => r.name === config.newUserRole)
      member.roles.add(role)
    } catch (error) {
      console.error(error)
    }
  }
}
