const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getRaidBossesList = async () => new Promise(async (res) =>
  res(await prisma.raidBosses.findMany({
    orderBy: { respawnStart: 'asc' }
  })))
  .catch((err) => { throw err })
  .finally(async () => await prisma.$disconnect())

const setRaidBossRespawn = async (id, name, respawnStart, respawnEnd) => new Promise(async () => {
  await prisma.raidBosses.upsert({
    create: { id, name, respawnStart, respawnEnd },
    update: { respawnStart, respawnEnd },
    where: { id }
  })
})
  .catch((err) => { throw err })
  .finally(async () => await prisma.$disconnect())

const getRaidBossesRespawnList = async () => new Promise(async (res) =>
  res(await prisma.raidBosses.findMany({
    where: {
      OR: [
        {
          respawnStart: {
            gt: new Date()
          }
        },
        {
          respawnEnd: {
            gt: new Date()
          }
        }
      ]
    },
    orderBy: { respawnStart: 'asc' }
  })))
  .catch((err) => { throw err })
  .finally(async () => await prisma.$disconnect())

const getRaidBossRespawn = async (name) => new Promise(async (res) =>
  res(await prisma.raidBosses.findFirst({
    where: { name }
  })))
  .catch((err) => { throw err })
  .finally(async () => await prisma.$disconnect())

const setTelegramUser = async (
  telegramUserId,
  telegramUsername,
  telegramChannelId,
  subscription
) => new Promise(async (res) =>
  res(await prisma.users.upsert({
    create: {
      telegramUserId,
      telegramUsername,
      telegramChannelId,
      subscription
    },
    update: { telegramUsername, telegramChannelId, subscription },
    where: { telegramUserId }
  })))
  .catch((err) => { throw err })
  .finally(async () => await prisma.$disconnect())

const getTelegramUsersList = async (telegramChannelId) => new Promise(async (res) => {
  res(await prisma.users.findMany({
    where: {
      telegramChannelId,
      subscription: true
    },
    orderBy: { telegramUsername: 'asc' }
  }))
})
  .catch((err) => { throw err })
  .finally(async () => await prisma.$disconnect())

const deleteTelegramUser = async (telegramUserId) => new Promise(async (res) => {
  const user = await prisma.users.findFirst({
    where: { telegramUserId }
  })

  user && await prisma.users.delete({
    where: { telegramUserId }
  })

  res('User has been removed successfully')
})
  .catch((err) => { throw err })
  .finally(async () => await prisma.$disconnect())

module.exports = {
  getRaidBossesList,
  setRaidBossRespawn,
  getRaidBossesRespawnList,
  getRaidBossRespawn,
  setTelegramUser,
  getTelegramUsersList,
  deleteTelegramUser
}
