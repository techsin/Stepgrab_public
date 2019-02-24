async function func(req, res) {
    let deal = (await req.user.getDeals({ where: {type:"custom", active: true}})) [0];
    deal.active = false;
    await deal.save();
    res.sendStatus(200);
}

module.exports = func;