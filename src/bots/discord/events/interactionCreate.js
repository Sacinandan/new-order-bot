const config = require('../config.json')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction, client) {
    if (interaction.isButton()) {
      if (interaction.customId === 'confirm') {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} press the confirm button.`)

        try {
          await interaction.deferReply({ ephemeral: true })
          const member = await interaction.member.fetch()
          const role = interaction.guild.roles.cache.find(r => r.name === config.assignedRulesUserRole)
          const prevRole = interaction.guild.roles.cache.find(r => r.name === config.newUserRole)
          await member.roles.add(role)
          await member.roles.remove(prevRole)

          await interaction.editReply({
            content: 'Agreements have been confirmed successfully!',
            ephemeral: true
          })
        }
        catch (error) {
          console.error(error)
        }
      } else if (interaction.customId === 'deny') {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} press the deny button.`)
        try {
          await interaction.deferReply({ ephemeral: true })
          const member = await interaction.member.fetch()
          const role = interaction.guild.roles.cache.find(r => r.name === config.newUserRole)
          await member.roles.remove(role)
          await interaction.editReply({ content: 'Agreements have been denied successfully!', ephemeral: true })
        }
        catch (error) {
          console.error(error)
        }
      } else {
        try {
          await interaction.deferReply({ ephemeral: true })
          await interaction.editReply({ content: 'Button has been clicked!', ephemeral: true })
        }
        catch (error) {
          console.error(error)
        }
      }
    } else if (!interaction.isCommand()) {
      console.log('is not command')
    } else if (!client.commands.has(interaction.commandName)) {
      console.log('command was not found')
    } else {
      console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered a command.`)

      try {
        await client.commands.get(interaction.commandName).execute(interaction, client)
      }
      catch (error) {
        console.error(error)
        await interaction.deferReply({ ephemeral: true })
        await interaction.editReply({
          content: 'There was an error while executing this command!',
          ephemeral: true
        })
      }
    }
  }
}
