const express = require('express');
const ExpressError = require('./errors');

const app = express(); // like app = FLASK(_name_)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to validate input
function validateNumbers(nums) {
  if (!nums) {
    throw new ExpressError("nums are required.", 400);
  }

  const numbers = nums.split(',').map(num => {
    const parsed = parseFloat(num);
    if (isNaN(parsed)) {
      throw new ExpressError(`${num} is not a number.`, 400);
    }
    return parsed;
  });

  return numbers;
}

// Route to calculate the mean
app.get('/mean', (req, res, next) => {
  try {
    const numbers = validateNumbers(req.query.numbers);
    const mean = numbers.reduce((acc, num) => acc + num, 0) / numbers.length;
    res.json({ operation: 'mean', value: mean });
  } catch (err) {
    next(err);
  }
});

// Route to calculate the median
app.get('/median', (req, res, next) => {
  try {
    const numbers = validateNumbers(req.query.numbers);
    numbers.sort((a, b) => a - b);
    const mid = Math.floor(numbers.length / 2);
    const median = numbers.length % 2 !== 0 ? numbers[mid] : (numbers[mid - 1] + numbers[mid]) / 2;
    res.json({ operation: 'median', value: median });
  } catch (err) {
    next(err);
  }
});

// Route to calculate the mode
app.get('/mode', (req, res, next) => {
  try {
    const numbers = validateNumbers(req.query.numbers);
    const frequency = {};
    let maxFreq = 0;
    let mode = [];

    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        mode = [num];
      } else if (frequency[num] === maxFreq) {
        mode.push(num);
      }
    });

    res.json({ operation: 'mode', value: mode });
  } catch (err) {
    next(err);
  }
});

// Handle 404 errors
app.use((req, res, next) => {
  const e = new ExpressError("Page Not Found", 404);
  next(e);
});

// Error handling middleware
app.use(function (err, req, res, next) {
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.message;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});

module.exports = app; // Export the app for testing

app.listen(3000, () => {
  console.log(`Listening on port 3000...`);
});
