const functions = require('firebase-functions')
const admin = require('firebase-admin')
const serviceAccount = require('./serviceAccountKey')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://yatta-log.firebaseio.com'
})
const db = admin.firestore()

function htmlForOGP(log) {
  const logData = log.data()
  return `<!DOCTYPE html><head lang="ja">
  <meta charset="UTF-8"/>
  <title>${logData.title}</title>
  <meta property="og:title" content="${logData.title}">
  <meta property="og:image" content="${logData.fileUrl}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${logData.title}">
  <meta name="twitter:image" content="${logData.fileUrl}">
  <link rel="canonical" href="/view/?l=${log.id}">
  </head><body>
  <script>window.location="/view/?l=${log.id}";</script>
  </body></html>`
}

exports.logShare = functions.https.onRequest(function(req, res) {
  const path = req.path.split('/')
  const logID = path[2]
  db.collection('logs').doc(logID).get()
    .then((doc) => {
      const html = htmlForOGP(doc)
      res.status(200).end(html)
    })
    .catch(err => {
      console.error(err)
      res.status(500).end(`id:${logID} is not found.`)
    })
})
