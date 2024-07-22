/** product: calculate the product of an array of numbers. */

function product(nums) {
  //base case
  if(nums.length===0){
    return 0;
  }
  if(nums.length===1){
    return nums[0];
  }
  //normal case
  const first = nums.shift()
  return first * product(nums)
}

/** longest: return the length of the longest word in an array of words. */

function longest(words) {
 //base case
  if(words.length===0){
    return 0;
  }
  //normal case
 const firstWordLength = words[0].length;
  const longestRest = longest(words.slice(1));

  // Return the maximum length
  return Math.max(firstWordLength, longestRest);
}

/** everyOther: return a string with every other letter. */

function everyOther(str) {
  //base case

  if(str.length===0){
    return '';
  }
  if(str.length===1){
    return str;
  }
  return str[0] + everyOther(str.slice(2));
}

/** isPalindrome: checks whether a string is a palindrome or not. */

function isPalindrome(str) {
//base case
  if (str.length <= 1) {
    return true;
  }

  if (str[0] !== str[str.length - 1]) {
    return false;
  }

  return isPalindrome(str.slice(1, -1));
}

/** findIndex: return the index of val in arr (or -1 if val is not present). */

function findIndex(arr, val) {
 // Helper function to handle recursion with an index parameter
  function search(arr, val, index) {
    // Base case: if the array is empty, return -1
    if (arr.length === 0) {
      return -1;
    }

    if (arr[0] === val) {
      return index;
    }

    return search(arr.slice(1), val, index + 1);
  }

  return search(arr, val, 0);
}




/** revString: return a copy of a string, but in reverse. */

function revString(str) {
  //base case
if(str.length===0){
  return '';
}
  return str[str.length -1] + revString(str.slice(0, -1));
}


/** gatherStrings: given an object, return an array of all of the string values. */

function gatherStrings(obj) {
  // Initialize an array to hold the strings
  let strings = [];

  // Helper function to handle recursion
  function gather(obj) {
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        strings.push(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        gather(obj[key]); // Recursive call for nested objects
      }
    }
  }

  // Start the recursion with the initial object
  gather(obj);

  return strings;
}

/** binarySearch: given a sorted array of numbers, and a value,
 * return the index of that value (or -1 if val is not present). */

function binarySearch(arr, val) {
  // Helper function to handle recursion with start and end indices
  function search(start, end) {
    // Base case: if the search range is invalid
    if (start > end) {
      return -1;
    }

    // Calculate the middle index
    const mid = Math.floor((start + end) / 2);

    if (arr[mid] === val) {
      return mid;
    } else if (arr[mid] > val) {
      return search(start, mid - 1);
    } else {
      return search(mid + 1, end);
    }
  }

  // Start the recursion with the full array range
  return search(0, arr.length - 1);
}


module.exports = {
  product,
  longest,
  everyOther,
  isPalindrome,
  findIndex,
  revString,
  gatherStrings,
  binarySearch
};
