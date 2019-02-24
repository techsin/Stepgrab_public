//create new deal for each deal that is different, and mark all previous as inactive.
//if same deals exists but is inactive, activate it
//in background delete all deals that have never been used and are in active
//
const db = require("../../db/models");
const Customer = db.Customer;
const Deal = db.Deal;
async function func(req, res) {
    let user = req.user;
    //valdiate all inputs
    if (validateInput(req)) { 
        res.redirect("/dashboard/discounts");
        return;
    }
    
    //delete any unused deals so far
    let unusedDeals = await user.getDeals({
        where: { "$Customers.id$": null },
        include: [{
            model: Customer,
            attributes: []
        }]
    });
    let unusedIds = unusedDeals.map(x => x.id);
    await Deal.destroy({ where: { id: unusedIds } })

    //make all active deals inactive to create new active deals
    let activeDeal = await user.getDeals({ where: { active: true } });
    
    for (let a of activeDeal) {
        a.active = false;
        await a.save();
    }
    
    //finally work with new deals
    let newDeals = normalizeInput(req.body.discounts);

    try {
        for (let n of newDeals) {
            let match = (await user.getDeals({ where: { type: n.type, amount: n.amount, position: n.position } }))[0]; //already exist

            if (match) {
                match.active = true;
                match.latitude = user.latitude;
                match.longitude = user.longitude;
                match.category = user.category;
                match.description = user.description;
                match.title = n.title;
                await match.save();
            } else {
                await user.createDeal({
                    latitude: user.latitude,
                    longitude: user.longitude,
                    category: user.category,
                    description: user.description,
                    title: n.title,
                    amount: n.amount,
                    type: n.type,
                    position: n.position,
                    active: true,
                });
            }
        }

        //update user wide / deal independent props
        user.shouldReset = req.body.shouldReset || false;
        user.resetAfterDays = req.body.resetAfterDays;
        await user.save();
    } catch (error) {
        req.flash("errors", error);
    }

    res.redirect("/dashboard/discounts");
}

function validateInput() {
    return false;
}

function normalizeInput(discounts) {
    return discounts.map(function (d, position) {
        let isPercentage = (d.percentage) ? true : false;
        let type = (isPercentage ? "percentage" : "number");
        let amount = d[type];
        return {
            type,
            position,
            amount,
            title: `${isPercentage ? "" : "$"}${amount}${isPercentage ? "%" : ""} off`
        }

    }).filter(x => x.amount)
}


module.exports = func;
