const prodFunctions = require('./functions')
const testFunctions = require('./functionsTests')


/**
 * The different environments are:
 *   TEST for testing with the emulator (npm start)
 *   DEPLOY for deploying functions
 * TODO: always change this to DEPLOY when deploying!
 */
const environment = 'TEST'

if (environment === 'TEST') {
  exports.autoCompanyArchiverTest = testFunctions.autoCompanyArchiverTest
  exports.weeklyUpdateCompaniesRankTest = testFunctions.weeklyUpdateCompaniesRankTest
  exports.moveCompanyTest = testFunctions.moveCompanyTest
  exports.deleteUserTest = testFunctions.deleteUserTest
}
else if (environment === 'DEPLOY') {
  exports.autoCompanyArchiver = prodFunctions.autoCompanyArchiver
  exports.weeklyUpdateCompaniesRank = prodFunctions.weeklyUpdateCompaniesRank
}
