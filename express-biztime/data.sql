-- Connect to the database
\c biztime

-- Drop tables if they exist
DROP TABLE IF EXISTS invoices;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS industries;
DROP TABLE IF EXISTS company_industries;

-- Create companies table
CREATE TABLE companies (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT
);

-- Create invoices table
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    comp_code TEXT NOT NULL REFERENCES companies(code) ON DELETE CASCADE,
    amt FLOAT NOT NULL,
    paid BOOLEAN DEFAULT FALSE NOT NULL,
    add_date DATE DEFAULT CURRENT_DATE NOT NULL,
    paid_date DATE,
    CONSTRAINT invoices_amt_check CHECK (amt > 0)
);

-- Create industries table
CREATE TABLE industries (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) NOT NULL UNIQUE,
    industry VARCHAR(100) NOT NULL
);

-- Create a junction table for many-to-many relationship
CREATE TABLE company_industries (
    company_code TEXT NOT NULL,
    industry_id INT NOT NULL,
    FOREIGN KEY (company_code) REFERENCES companies(code) ON DELETE CASCADE,
    FOREIGN KEY (industry_id) REFERENCES industries(id) ON DELETE CASCADE,
    PRIMARY KEY (company_code, industry_id)
);

-- Insert sample data into companies
INSERT INTO companies (code, name, description) VALUES
('apple', 'Apple Computer', 'Maker of OSX.'),
('ibm', 'IBM', 'Big blue.');

-- Insert sample data into invoices
INSERT INTO invoices (comp_code, amt, paid, paid_date) VALUES
('apple', 100, false, NULL),
('apple', 200, false, NULL),
('apple', 300, true, '2018-01-01'),
('ibm', 400, false, NULL);

-- Insert sample data into industries
INSERT INTO industries (code, industry) VALUES
('acct', 'Accounting'),
('it', 'Information Technology'),
('fin', 'Finance'),
('mkt', 'Marketing'),
('hr', 'Human Resources');

INSERT INTO company_industries (company_code, industry_id) VALUES
('apple', 1),  -- Apple in Accounting
('apple', 2),  -- Apple in Information Technology
('ibm', 3),    -- IBM in Finance
('ibm', 4);    -- IBM in Marketing