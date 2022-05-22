module.exports = {
  name: 'ready',
  once: true,
  async execute (interaction, client) {
    try {
      console.log(`Discord bot ${client.user.tag} is running!`)
    }
    catch (error) {
      console.error(error)
    }
  }
}
