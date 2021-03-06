const prodFunctions = require('./functions')
const testFunctions = require('./functionsTests')


/**
 * The different environments are:
 *   TEST for testing with the emulator (npm start)
 *   PROD for deploying functions
 */
const environment = 'TEST'

if (environment === 'TEST') {
  exports.autoCompanyArchiverTest = testFunctions.autoCompanyArchiverTest
  exports.weeklyUpdateCompaniesRankTest = testFunctions.weeklyUpdateCompaniesRankTest
  exports.moveCompanyTest = testFunctions.moveCompanyTest
}
else if (environment === 'PROD') {
  exports.autoCompanyArchiver = prodFunctions.autoCompanyArchiver
  exports.weeklyUpdateCompaniesRank = prodFunctions.weeklyUpdateCompaniesRank
}
