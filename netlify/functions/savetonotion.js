// Notion API client library (optional but recommended for bigger projects)
// For this simple case, we use fetch.
const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // CORS headers to allow requests from your website
    const headers = {
        'Access-Control-Allow-Origin': '*', // Or specify your domain for better security
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight CORS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: 'This was a preflight request'
        };
    }

    try {
        const { noteContent } = JSON.parse(event.body);

        if (!noteContent) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'noteContent is required' })
            };
        }

        const title = noteContent.substring(0, 100); // Use first 100 chars as title
        const contentBlocks = noteContent.split('\n').filter(p => p.trim() !== '').map(p => ({
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: [{
                    type: 'text',
                    text: {
                        content: p
                    },
                }, ],
            },
        }));


        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NOTION_API_KEY}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                parent: { database_id: NOTION_DATABASE_ID },
                properties: {
                    'Name': { // This must match your database's title column name
                        title: [{
                            text: {
                                content: title
                            }
                        }]
                    }
                },
                children: contentBlocks // The actual content of the note
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Notion API Error:', errorData);
            throw new Error(`Notion API returned status ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Successfully saved to Notion!', data: data })
        };

    } catch (error) {
        console.error('Error saving to Notion:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to save note to Notion.' })
        };
    }
};