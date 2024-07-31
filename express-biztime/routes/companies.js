
const express = require("express");
const router = express.Router();
const db = require("../db")
const ExpressError = require("../expressError");
const slugify = require("slugify");


//Returns list of companies
router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`
            SELECT 
                c.code AS company_code,
                c.name AS company_name,
                c.description AS company_description,
                ARRAY_AGG(i.industry) AS industries
            FROM 
                companies AS c
            LEFT JOIN 
                company_industries AS ci ON c.code = ci.company_code
            LEFT JOIN 
                industries AS i ON ci.industry_id = i.id
            GROUP BY 
                c.code, c.name, c.description
        `);
        return res.json({ companies: results.rows });
    } catch (e) {
        return next(e);
    }
});



//Return obj of company

router.get('/:code', async (req, res, next) => {
    try{
       const {code} = req.params;
       const results = await db.query( `SELECT * FROM companies WHERE code=$1`, [code])//one query -one value
         if(results.rows.length===0){
          throw new ExpressError(`Can't find company with code of ${code} `, 404)
        }
        return res.json({ company: results.rows[0] }); // Use res.json for JSON response
    }catch(e){
        return next(e);
    }
})



//Adds a company
router.post('/', async(req, res, next) => {
    try{
        const {name,description} = req.body;
        const code = slugify(name, {lower: true});
        const results = await db.query("INSERT INTO companies(code, name, description) VALUES($1, $2, $3) RETURNING code, name, description", [code, name, description])
        return res.status(201).json({company: results.rows[0]})//deleted extra braces - getting as a json obj
    }catch(e){
        return next(e);
    }
})

// PUT route to update an existing company
router.put('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;

        const results = await db.query(
            'UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description',
            [name, description, code]
        );

        if (results.rows.length === 0) {
            throw new ExpressError(`Can't update company with code of ${code}`, 404);
        }

        return res.json({ company: results.rows[0] });
    } catch (e) {

        return next(e);
    }
});


router.delete('/:code', async(req, res, next) => {
    try{
        const results = db.query('DELETE FROM companies WHERE code =$1', [req.params.code])
        return res.send({msg: "status: 'DELETED'"})
    }catch(e){
        return next(e);
    }
})

// GET route to get a company by code and include invoices
router.get('/:code', async (req, res, next) => {
    try {
        const { code } = req.params;

        const companyResults = await db.query(
            `SELECT code, name, description FROM companies WHERE code = $1`,
            [code]
        );

        if (companyResults.rows.length === 0) {
            throw new ExpressError(`Can't find company with code of ${code}`, 404);
        }

        const invoiceResults = await db.query(
            `SELECT id FROM invoices WHERE comp_code = $1`,
            [code]
        );

        const company = companyResults.rows[0];
        company.invoices = invoiceResults.rows.map(invoice => invoice.id);

        return res.json({ company });
    } catch (e) {
        return next(e);
    }
});
module.exports = router;