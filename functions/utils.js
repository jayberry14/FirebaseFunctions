const admin = require('firebase-admin');
const _ = require('lodash'); // JavaScript/Node.js library extension
admin.initializeApp();


/** Script archiving based on company creation date */
const autoCompanyArchiverJob = async () => {
  // Get the companies
  const activeCompaniesRef = admin.firestore().collection('activeCompanies')
  const activeCompaniesSnapshot = await activeCompaniesRef.where('contentUpdateCt', '>', 0).get()

  // Archive them
  activeCompaniesSnapshot.forEach(await (async (activeCompany) => {
    try {
      await moveCompany('activeCompanies', 'archivedCompanies', activeCompany.id)
    } catch (error) {
      console.error(`${error.code}: ${error.message}`)
    }
  }))
}


/**
 * Update the Companies' Rank
 *
 * Ranking System
 * Weights:
 *   rating = ranges from 100% to 200% of the combined pageVisitsCt and contentUpdateCt
 *   pageVisitsCt = 70%
 *   contentUpdateCt = 30%
 *
 * System: rank = (rating/5+1) * (pageVisitsCt*0.7 + contentUpdateCt*0.3)
 *
 * todo: If companies reaches top 4 or top 1, then they receive an email congratulating them
 */
const weeklyUpdateCompaniesRankJob = async () => {
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
}


/**
 * Move a company from A to B
 * Should this go in a file called utils.js ?
 * @param moveToCollection B
 * @param fromCollection A
 * @param companyGUID
 * @returns {Promise<void>}
 */
const moveCompany = async (fromCollection, moveToCollection, companyGUID) => {
  const newCollection = moveToCollection;
  const oldCollection = fromCollection;

  // get company
  const oldCompanyLocationRef = admin.firestore().collection(oldCollection).doc(companyGUID)
  const companyDataSnapshot = await oldCompanyLocationRef.get()
  const companyData = companyDataSnapshot.data()

  // copy company to new location
  await admin.firestore().collection(newCollection).doc(companyGUID).set(companyData)

  // verify creation
  const newCompanyLocationRef = admin.firestore().collection(newCollection).doc(companyGUID)
  const newCollectionSnapshot = await newCompanyLocationRef.get()
  if (!newCollectionSnapshot.exists) {
    let error = Error(`Error: new company '${newCollection}/${companyGUID}' was not created`)
    error.code = 'notCreated'
    throw error
  }
  else if (!_.isEqual(newCollectionSnapshot.data(), companyData)) {
    newCompanyLocationRef.delete()

    let error = Error(`Error: new company '${newCollection}/${companyGUID}' was not created the same as the old one.`)
    error.code = 'notCreatedEqual'
    throw error
  }

  // delete company at old location
  oldCompanyLocationRef.delete()
}


exports.autoCompanyArchiverJob = autoCompanyArchiverJob;
exports.weeklyUpdateCompaniesRankJob = weeklyUpdateCompaniesRankJob;
exports.moveCompany = moveCompany;