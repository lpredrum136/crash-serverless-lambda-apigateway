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

  const { id, firstname, lastname } = JSON.parse(event.body)

  const params = {
    TableName: 'Users',
    Item: {
      id,
      firstname,
      lastname
    }
  }

  try {
    const data = await documentClient.put(params).promise()
    console.log('Data POST successful')
    console.log(data)

    const body = JSON.stringify(data)
    const statusCode = 201

    return {
      statusCode,
      headers: {
        myHeader: 'success POST'
      },
      body
    }
  } catch (error) {
    console.log(error)
    const body = `Unable to PUT user data`
    const statusCode = 403

    return {
      statusCode,
      headers: {
        myHeader: 'failure POST'
      },
      body
    }
  }
}
