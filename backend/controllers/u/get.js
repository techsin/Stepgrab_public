let map = require("./shared/map");

async function func(req, res) {
	map(req, res);
}

module.exports = func;


// let obj = await db.sequelize.query(query, { type: db.sequelize.QueryTypes.SELECT })
// '2015-02-06'  AND "DealsUseds"."updatedAt"::date <= NOW() - INTERVAL '7 DAY' <<<--- when to renew deals for user
// let query = `
// SELECT DISTINCT ON ("UserId") "UserId", * FROM "Deals"
// LEFT JOIN "DealsUseds" ON "DealsUseds"."DealId" = "Deals".id AND "DealsUseds"."CustomerId" = ${req.customer.id}
// WHERE "DealsUseds"."DealId" IS NULL AND ("Deals".active = true) AND ("Deals".latitude BETWEEN 40 AND 41) AND ("Deals".longitude BETWEEN -75 AND -70)
// ORDER BY "UserId", "Deals".position;
// `;



// Sequelize.col('dea.state')
// let obj = await Deal.findAll({
//     where: { active: true, "$Customers.id$": { $or: [null, { $not: req.customer.id }] } },
//     include: [{
//         model: Customer,
//         attributes: [],
//         where: { id: req.customer.id }
//     }]
// });




// let obj = await Deal.findAll({
//     where: { active: true },
//     include: [{
//         model: User,
//         where: { latitude: { $between: [40, 41] }, longitude: { $between: [-76, -72] } },
//         required: true,
//         attributes: ["id"]
//     }]
// });

// SELECT *, min(gd.position)  FROM

// (SELECT * FROM "Deals") AS gd

// LEFT JOIN

// (SELECT "DealId" FROM "DealsUseds" WHERE "CustomerId" = 1) AS bd

// ON gd.id = bd."DealId"

// WHERE bd."DealId" IS NULL
// GROUP BY gd."UserId";



// -- SELECT *, min("Deals".position) FROM "Deals" LEFT JOIN "DealsUsed" ON "DealsUsed"."DealId" = "Deals".id AND "DealsUsed"."CustomerId" = 1 WHERE "DealsUsed"."DealId" IS NULL GROUP BY "Deals"."UserId";

// -- SELECT *, min(gd.position)  FROM
// --
// -- (SELECT * FROM "Deals" as d WHERE (d.active = true) AND (d.latitude BETWEEN 40 AND 41) AND (d.longitude BETWEEN -75 AND -70)) AS gd
// --
// -- LEFT JOIN
// --
// -- (SELECT du."DealId" FROM "DealsUsed" AS du WHERE du."CustomerId" = 1) AS bd
// --
// -- ON gd.id = bd."DealId"
// -- WHERE bd."DealId" IS NULL
// -- GROUP BY gd."UserId";



// --
// -- SELECT *, min(okd.position) FROM
// --
// -- (SELECT * FROM "Deals" as d
// -- WHERE (d.active = true) AND (d.latitude BETWEEN 40 AND 41) AND (d.longitude BETWEEN -75 AND -70)) AS okd
// --
// -- LEFT JOIN
// --
// -- (SELECT * FROM "Deals" as ad INNER JOIN
// --   (SELECT * FROM "DealsUsed" AS du WHERE du."CustomerId" = 1) AS rd
// -- ON rd."DealId" = ad.id) as dd
// --
// -- ON dd."UserId" = okd."UserId" AND dd.position = okd.position
// -- WHERE dd.id IS NULL
// -- GROUP BY okd."UserId";