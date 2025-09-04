const { Client } = require('@notionhq/client');

// NEW HELPER FUNCTION: To split long text into chunks of 2000 characters
const splitTextIntoChunks = (text, chunkSize = 2000) => {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.substring(i, i + chunkSize));
  }
  return chunks;
};

// Netlify Serverless Function structure
exports.handler = async (event, context) => {
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

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const { noteContent, notionApiKey, notionDbId } = JSON.parse(event.body);

    if (!noteContent || !notionApiKey || !notionDbId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields: noteContent, notionApiKey, or notionDbId' }),
      };
    }

    const notion = new Client({ auth: notionApiKey });

    // MODIFIED: Split the long noteContent into smaller chunks
    const noteChunks = splitTextIntoChunks(noteContent);

    // Prepare the data structure for the Notion database
    const properties = {
      "Name": {
        "title": [
          {
            "text": {
              "content": noteContent.substring(0, 80) + (noteContent.length > 80 ? '...' : ''),
            },
          },
        ],
      },
      // MODIFIED: Map over the chunks to create multiple text blocks
      "Note": {
        "rich_text": noteChunks.map(chunk => ({
          "type": "text",
          "text": {
            "content": chunk,
          },
        })),
      },
      "Tag": {
        "multi_select": [
            { "name": "ZinNotes" }
        ]
      },
      "Date": {
        "date": {
            "start": new Date().toISOString()
        }
      }
    };

    const response = await notion.pages.create({
      parent: { database_id: notionDbId },
      properties: properties,
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: true, message: 'Successfully saved to Notion!', data: response }),
    };

  } catch (error) {
    console.error('Error saving to Notion:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
