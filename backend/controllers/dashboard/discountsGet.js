async function func(req, res) {
    let data = await req.user.getDeals({ where: { type: { $or: ["percentage", "number"] }, active: true} });
    let obj = [];

    data.forEach(x => {
        obj[x.position] = obj[x.position] || {};
        obj[x.position][x.type] = x.amount;
    });

    if (data.length > 0) {
        res.locals.gradualActive = true;
    }

    let customActive = await req.user.getDeals({ where: { type: "custome" , active: true} });
    if (customActive.length > 0) {
        res.locals.customActive = true;
    }

    
    res.locals.shouldReset = req.user.shouldReset;
    res.locals.resetAfterDays = req.user.resetAfterDays;
    res.locals.gradualDiscounts = obj
    res.render("dashboard/discounts");
}

module.exports = func;