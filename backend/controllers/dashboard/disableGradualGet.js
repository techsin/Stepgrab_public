async function func(req, res) {
    let deals = await req.user.getDeals({ where: { type: { $or: ["percentage", "number"] }, active: true} });
    deals.forEach(async (d) => {
        d.active = false;
        await d.save();
    });
    res.redirect("/dashboard/discounts")
}

module.exports = func;