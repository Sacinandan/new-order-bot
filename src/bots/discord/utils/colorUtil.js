exports.getColor = (alliance, drop, chance) => {
    if (chance > 0 && chance < 100) {
        return alliance === 'New Order' && drop
               ? '#00ff00'
               : alliance === 'New Order' && !drop
                 ? '#ffff00'
                 : '#ff0000'
    } else {
        return alliance === 'New Order'
               ? '#00ff00'
               : '#ff0000'
    }
}
