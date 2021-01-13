'use strict'
const AWS = require('aws-sdk')

AWS.config.update({ region: 'ap-southeast-2' })

exports.handler = async (event, context) => {
  // console.log(JSON.stringify(`Event: event`))
  // Lambda Code Here
  // context.succeed('Success!')
  // context.fail('Failed!')
  const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' })
  const documentClient = new AWS.DynamoDB.DocumentClient({
    region: 'ap-southeast-2'
  })

  const { id } = event.pathParameters

  const params = {
    TableName: 'Users',
    Key: {
      id
    }
  }

  try {
    const data = await documentClient.get(params).promise()
    console.log('Data successful')
    console.log(data)
    const body = JSON.stringify(data.Item)
    const statusCode = 200

    return {
      statusCode,
      headers: {
        myHeader: 'success'
      },
      body
    }
  } catch (error) {
    console.log(error)
    const body = `Unable to get user data`
    const statusCode = 403

    return {
      statusCode,
      headers: {
        myHeader: 'failure'
      },
      body
    }
  }
}
