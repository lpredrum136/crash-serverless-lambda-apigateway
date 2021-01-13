'use strict'
const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-southeast-2' })

const s3 = new AWS.S3()
const documentClient = new AWS.DynamoDB.DocumentClient({
  region: 'ap-southeast-2'
})

exports.handler = async (event, context) => {
  // console.log(JSON.stringify(`Event: event`))
  // Lambda Code Here
  // context.succeed('Success!')
  // context.fail('Failed!')
  const { name } = event.Records[0].s3.bucket
  const { key } = event.Records[0].s3.object

  const getObjectParams = {
    Bucket: name,
    Key: key
  }

  try {
    const s3data = await s3.getObject(getObjectParams).promise()
    console.log('Get s3data from S3 successful')
    console.log(s3data)

    const usersStr = s3data.Body.toString()
    const usersJSON = JSON.parse(usersStr)
    console.log(`User:::${usersStr}`)

    // Add to DB

    const usersBatch = usersJSON.map(user => ({
      PutRequest: {
        Item: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname
        }
      }
    }))

    const userBatchParams = {
      RequestItems: {
        'Users-Batch': usersBatch
      }
    }

    const usersPutData = await documentClient
      .batchWrite(userBatchParams)
      .promise()
    console.log('PUT batch results: ', usersPutData)
  } catch (error) {
    console.log(error)
  }
}
