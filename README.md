# Firebase Functionalities for the IBC Wallet app

## Functions
------------
### Auto-archive companies
Script archiving based on company creation date run on last day of 4th, 7th, & 12th month

### Update the company ranks (top1 or top4)
Weekly Script that updates which companies are in top1 and top4

**Ranking System** \
Weights:
* rating = ranges from 100% to 200% of the combined pageVisitsCt and contentUpdateCt
* pageVisitsCt = 70%
* contentUpdateCt = 30%

System: `rank = (rating/5+1) * (pageVisitsCt*0.7 + contentUpdateCt*0.3)`

### Write script (Firebase Function) to auto-delete 4yr old companies
Script deleting companies 4 years old or more that runs mid-summers.