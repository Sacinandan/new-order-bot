exports.getDropInfo = (isDrop, chance) => {
    if (chance > 0 && chance < 100) {
        return `${isDrop ? '[DROP]' : '[NO DROP]'}`
    } else {
        return ''
    }
}
