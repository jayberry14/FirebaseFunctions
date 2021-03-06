/**
 * These are the Functions that are deployed to Firebase Functions
 *
 * Write a scheduled function:
 * https://firebase.google.com/docs/functions/schedule-functions
 *
 * Create and Deploy Your First Cloud Functions
 * https://firebase.google.com/docs/functions/write-firebase-functions
 */

const utils = require("./utils");
const functions = require("firebase-functions");


/**
 * Auto archives companies
 * Repeats every 30th of April, September, and December at midnight
 */
exports.autoCompanyArchiver = functions.pubsub.schedule('30 of apr, sep, dec 00:00')
  .timeZone('America/Denver')
  .onRun(utils.autoCompanyArchiverJob)


/**
 * Weekly updates companies' rank
 * Repeats every Monday at midnight
 */
exports.weeklyUpdateCompaniesRank = functions.pubsub.schedule('every monday 00:00')
  .timeZone('America/Denver')
  .onRun(utils.weeklyUpdateCompaniesRankJob);
