const { REST } = require('@discordjs/rest')

/**
 * @class
 * @extends REST
 */
class Rest extends REST {

  /**
   * @constructor
   * @param {number} version
   */
  constructor (version) {
    super({ version: version.toString() })
  }
}

module.exports = Rest
