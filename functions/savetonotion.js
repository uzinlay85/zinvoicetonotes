const fetch = global.fetch || require('node-fetch');

exports.handler = async function(event, context) {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405, 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    const headers = {
        'Access-Control-Allow-Origin': '*', // Change to specific domain in production!
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight CORS request
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: 'Preflight CORS OK' };
    }

    try {
        const { noteContent, notionApiKey, notionDbId } = JSON.parse(event.body || '{}');

        if (!noteContent || !notionApiKey || !notionDbId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Missing required fields: noteContent, notionApiKey, notionDbId' })
            };
        }

        const title = noteContent.substring(0, 100);
        const contentBlocks = noteContent.split('\n')
            .filter(p => p.trim() !== '')
            .map(p => ({
                object: 'block',
                type: 'paragraph',
                paragraph: { rich_text: [{ type: 'text', text: { content: p } }] }
            }));

        // Notion API call
        const notionResponse = await fetch('https://api.notion.com/v1/pages', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${notionApiKey}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            body: JSON.stringify({
                parent: { database_id: notionDbId },
                properties: {
                    // Adjust property name to match Notion DB title property
                    Name: {
                        title: [{ text: { content: title } }]
                    }
                },
                children: contentBlocks
            })
        });

        const data = await notionResponse.json();
        if (!notionResponse.ok) {
            // Notion API error message fallback
            const errorMsg = data.message || data.error || 'Unknown error';
            return {
                statusCode: notionResponse.status,
                headers,
                body: JSON.stringify({ error: `Notion API Error: ${errorMsg}` })
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Successfully saved to Notion!', data })
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
