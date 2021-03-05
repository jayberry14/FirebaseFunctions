/**
 * Write a scheduled function:
 * https://firebase.google.com/docs/functions/schedule-functions
 *
 * Create and Deploy Your First Cloud Functions
 * https://firebase.google.com/docs/functions/write-firebase-functions
 */
const functions = require("firebase-functions");
const admin = require('firebase-admin');
admin.initializeApp();


/**
 * Update the Companies' Rank
 * Weekly updates which companies are in top1 and top4
 *
 * Ranking System
 * Weights:
 *   rating = ranges from 100% to 200% of the combined pageVisitsCt and contentUpdateCt
 *   pageVisitsCt = 70%
 *   contentUpdateCt = 30%
 *
 * System: rank = (rating/5+1) * (pageVisitsCt*0.7 + contentUpdateCt*0.3)
 *
 * If companies reaches top 4 or top 1, then they receive an email congratulating them
 */
exports.weeklyUpdateCompaniesRank = functions.pubsub.schedule('every monday 00:00')
  .timeZone('America/Denver')
  .onRun(async context => {
    try {
      const companiesRef = admin.firestore().collection('activeCompanies')
      const companiesSnapshot = await companiesRef.where('contentUpdateCt', '>', 0).get()
      if (companiesSnapshot.empty) {
        console.info('No active companies found to update')
        return null;
      }

      companiesSnapshot.forEach(companySnapshot => {
        const company = companySnapshot.data()

        const rating = company.rating.sum / company.rating.ratingsCt
        companySnapshot.ref.update({
          rank: (rating/5+1) * (company.pageVisitsCt*0.7 + company.contentUpdateCt*0.3)
        })
      })
      return null;
    } catch (error) {
      console.error("Unable to update companies' rank: ", error)
    }
});
