const admin = require('firebase-admin');
const _ = require('lodash'); // JavaScript/Node.js library extension
admin.initializeApp();


/**
 * Script archiving based on company creation date
 * Also deletes the associated accounts
 */
const autoCompanyArchiverJob = async () => {
  // Get the companies
  const activeCompaniesRef = admin.firestore().collection('activeCompanies')
  const accountsToDeleteRef = admin.firestore().collection('accounts')
  const activeCompaniesSnapshot = await activeCompaniesRef.where('contentUpdateCt', '>', 0).get()

  // Archive them
  activeCompaniesSnapshot.forEach(await (async (activeCompany) => {
    try {
      await moveCompany('activeCompanies', 'archivedCompanies', activeCompany.id)

      // Delete the associated account
      const accountToDeleteRef = accountsToDeleteRef.where('companyRef', '==', activeCompany.ref).limit(1)
      const accountToDeleteSnapshot = await accountToDeleteRef.get()
      accountToDeleteSnapshot.forEach(account => {
        // Delete their data in Firestore
        account.ref.delete()
        // Delete the actual user from Auth
        deleteUser(account.id)
      })
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

    // Update the rank
    companiesSnapshot.forEach(companySnapshot => {
      const company = companySnapshot.data()

      const rating = company.rating.sum / company.rating.ratingsCt
      companySnapshot.ref.update({
        rank: (rating/5+1) * (company.pageVisitsCt*0.7 + company.contentUpdateCt*0.3)
      })
    })

    // Update the 'topCompanyCt' and 'top4Ct' fields respectively
    companiesRef.orderBy('rank', 'desc').limit(4).get().then(snapshot => {
      let i = 0
      snapshot.forEach(topCompany => {
        if (i === 0) {
          topCompany.ref.update({ topCompanyCt: admin.firestore.FieldValue.increment(1) })
        }
        topCompany.ref.update({ top4Ct: admin.firestore.FieldValue.increment(1) })
        i++
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


/**
 * Delete user by UID
 * @param uid
 * @returns {Promise<void>}
 */
const deleteUser = async (uid) => {
  try {
    await admin.auth().deleteUser(uid)
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.log(`Unable to delete user '${uid}': ${error.message}`)
      return
    }
    throw error
  }
}


exports.autoCompanyArchiverJob = autoCompanyArchiverJob;
exports.weeklyUpdateCompaniesRankJob = weeklyUpdateCompaniesRankJob;
exports.moveCompany = moveCompany;
exports.deleteUser = deleteUser;
