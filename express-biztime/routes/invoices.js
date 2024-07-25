
const express = require("express");
const router = express.Router();
const db = require("../db")
const ExpressError = require("../expressError");

//Returns list of invoices
router.get('/', async(req, res, next) => {
    try{
        const results = await db.query('SELECT * FROM invoices');
        return res.json({invoices: results.rows})
    } catch(e){
        return next(e);
    }

});

//Return obj on given invoice

router.get('/:id', async (req, res, next) => {
    try{
       const {id} = req.params;
        const results = await db.query(
            `SELECT invoices.id, invoices.amt, invoices.paid, invoices.add_date, invoices.paid_date,
                    companies.code AS company_code, companies.name AS company_name, companies.description AS company_description
             FROM invoices
             JOIN companies ON invoices.comp_code = companies.code
             WHERE invoices.id = $1`,
            [id]
        );
         if(results.rows.length===0){
          throw new ExpressError(`Can't find invoice with id of ${id} `, 404)
        }
         const invoice = results.rows[0];
         const formattedResponse = {
             id: invoice.id,
             amt: invoice.amt,
             paid: invoice.paid,
             add_date: invoice.add_date,
             paid_date: invoice.paid_date,
             company: {
                 code: invoice.company_code,
                 name: invoice.company_name,
                 description: invoice.company_description
             }
         };
        return res.json({ invoice: formattedResponse });
    }catch(e){
        return next(e);
    }
})


// Adds an invoice
router.post('/', async (req, res, next) => {
    try {
        const { comp_code, amt } = req.body;

        // Basic validation
        if (!comp_code || !amt) {
            throw new ExpressError("Missing required data: 'comp_code' and 'amt'", 400);
        }

        const results = await db.query(
            "INSERT INTO invoices (comp_code, amt) VALUES ($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date",
            [comp_code, amt]
        );

        return res.status(201).json({ invoice: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});


// PUT route to update an existing invoice
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { amt } = req.body;

        const results = await db.query(
            'UPDATE invoices SET amt=$1  WHERE id=$2 RETURNING id, comp_code, amt, paid, add_date, paid_date',
            [amt, id]
        );

        if (results.rows.length === 0) {
            throw new ExpressError(`Can't found invoice with id of ${id}`, 404);
        }

        return res.json({ invoice: results.rows[0] });
    } catch (e) {

        return next(e);
    }
});

// DELETE route to delete an invoice
router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const results = await db.query('DELETE FROM invoices WHERE id=$1 RETURNING id', [id]);

        if (results.rows.length === 0) {
            throw new ExpressError(`Can't find invoice with id of ${id}`, 404);
        }

        return res.json({ status: "deleted" });
    } catch (e) {
        return next(e);
    }
});




module.exports = router;