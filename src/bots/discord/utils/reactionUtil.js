exports.getReaction = (alliance, drop, chance) => {
    if (chance > 0 && chance < 100) {
        return alliance === 'New Order' && drop
            ? '🟢'
            : alliance === 'New Order' && !drop
                ? '🟡'
                : '🔴'
    } else {
        return alliance === 'New Order'
            ? '🟢'
            : '🔴'
    }
}
