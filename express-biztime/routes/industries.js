const express = require("express");
const router = express.Router();
const db = require("../db")
const ExpressError = require("../expressError");

//Add an industry
router.post("/", async (req, res, next) => {
    try{
        const {code, industry} = req.body;
        const result = await db.query( 'INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING *', [code, industry]);
        return res.status(201).json({industry: result.rows[0]})
    } catch(e){
        return next(e)
    }
})

//list all industries with company code
router.get('/industries', async (req, res, next) => {
    try {
        const results = await db.query(`
            SELECT 
                i.id,
                i.code AS industry_code,
                i.industry,
                ARRAY_AGG(ci.company_code) AS company_codes
            FROM 
                industries AS i
            LEFT JOIN 
                company_industries AS ci ON i.id = ci.industry_id
            GROUP BY 
                i.id, i.code, i.industry
        `);
        return res.json({ industries: results.rows });
    } catch (e) {
        return next(e);
    }
});


//associating an industry with a company
router.post('/companies/:companyCode/industries', async (req, res, next) => {
    try {
        const { companyCode } = req.params;
        const { industryId } = req.body;
        const result = await db.query(
            'INSERT INTO company_industries (company_code, industry_id) VALUES ($1, $2) RETURNING *',
            [companyCode, industryId]
        );
        return res.status(201).json({ companyIndustry: result.rows[0] });
    } catch (e) {
        return next(e);
    }
});


module.exports=router;