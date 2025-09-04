exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // CORS headers for security
    const headers = {
        'Access-Control-Allow-Origin': '*', // Allows any domain to call this function. For production, you might want to restrict this to your netlify domain.
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
    };

    // Handle preflight CORS request for browsers
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: 'This was a preflight request' };
    }

    try {
        // Get the user's specific data from the request sent by the browser
        const { noteContent, notionApiKey, notionDbId } = JSON.parse(event.body);

        // Validate that all required data is present
        if (!noteContent || !notionApiKey || !notionDbId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields: noteContent, notionApiKey, or notionDbId' })
            };
        }

        const title = noteContent.substring(0, 100); // Use first 100 chars as title
        const contentBlocks = noteContent.split('\n').filter(p => p.trim() !== '').map(p => ({
            object: 'block',
            type: 'paragraph',
            paragraph: {
                rich_text: [{ type: 'text', text: { content: p } }],
            },
        }));

        // Use the USER-PROVIDED keys to call the Notion API
        const response = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionApiKey}`, // Use the key from the request
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                parent: { database_id: notionDbId }, // Use the database ID from the request
                properties: {
                    'Name': {
                        title: [{ text: { content: title } }]
                    }
                },
                children: contentBlocks
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Notion API Error:', errorData);
            // Provide a more specific error message back to the user
            return {
                statusCode: response.status,
                headers,
                body: JSON.stringify({ error: `Notion API Error: ${errorData.message}` })
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Successfully saved to Notion!', data: data })
        };

    } catch (error) {
        console.error('Server error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to process request.' })
        };
    }
};
