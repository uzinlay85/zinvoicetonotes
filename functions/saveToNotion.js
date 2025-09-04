const { Client } = require('@notionhq/client');

// Netlify Serverless Function structure
exports.handler = async (event, context) => {
  // Handle pre-flight CORS request for browsers
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
    };
  }

  // Ensure the request is a POST request
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // 1. Parse data from the frontend request
    const { noteContent, notionApiKey, notionDbId } = JSON.parse(event.body);

    // Check if all required data is present
    if (!noteContent || !notionApiKey || !notionDbId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: noteContent, notionApiKey, or notionDbId' }),
      };
    }

    // 2. Initialize the Notion client with the user's API key
    const notion = new Client({ auth: notionApiKey });

    // 3. Prepare the data structure for the Notion database
    //    IMPORTANT: The keys "Name" and "မှတ်စု" MUST exactly match your Notion database column names.
    const properties = {
      // For the "Name" (Title) column, use a short summary of the note
      "Name": {
        "title": [
          {
            "text": {
              "content": noteContent.substring(0, 80) + (noteContent.length > 80 ? '...' : ''),
            },
          },
        ],
      },
      // For the "မှတ်စု" (Rich Text) column, use the full content of the note
      // If your column name is different, change "မှတ်စု" to your column's name.
      "မှတ်စု": {
        "rich_text": [
          {
            "text": {
              "content": noteContent,
            },
          },
        ],
      },
    };

    // 4. Create a new page in the Notion database
    const response = await notion.pages.create({
      parent: { database_id: notionDbId },
      properties: properties,
    });

    // 5. Send a success response back to the frontend
    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, message: 'Successfully saved to Notion!', data: response }),
    };

  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error saving to Notion:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
