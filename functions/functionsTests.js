/**
 * These Functions for testing locally on an emulator by calling them from the browser or such
 *
 * Create and Deploy Your First Cloud Functions
 * https://firebase.google.com/docs/functions/write-firebase-functions
 */

const utils = require("./utils");
const functions = require("firebase-functions");


/** Test Function to archive companies that are active */
exports.autoCompanyArchiverTest = functions.https.onRequest(async (req, res) => {
  try {
    await utils.autoCompanyArchiverJob()
  } catch (error) {
    res.send(error.message)
  }
  res.send('ok')
})


/** Test Function to update the companies' rank */
exports.weeklyUpdateCompaniesRankTest = functions.https.onRequest(async (req, res) => {
  try {
    await utils.weeklyUpdateCompaniesRankJob()
  } catch (error) {
    res.send(error.message)
  }
  res.send('ok')
})


/** Test Function to move a company around */
exports.moveCompanyTest = functions.https.onRequest(async (req, res) => {
  try {
    await utils.moveCompany(req.query.fromCollection, req.query.moveToCollection, req.query.companyGUID)
  } catch(error) {
    res.status(500)
    res.send(error.message)
    return
  }
  res.send('Successfully moved!')
})
