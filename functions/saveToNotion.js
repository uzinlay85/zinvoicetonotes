const { Client } = require('@notionhq/client');

const notion = new Client({ auth: "YOUR_NOTION_INTEGRATION_TOKEN" }); // သင့် token ဖြည့်ပါ
const databaseId = 'YOUR_DATABASE_ID'; // သင့် database ID ဖြည့်ပါ

async function saveToNotion(payload) {
  try {
    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: payload
    });

    // response content-type check
    if (
      response &&
      response.constructor === Object &&
      response.object !== "error"
    ) {
      console.log("Saved successfully:", response);
      return response;
    } else {
      throw new Error("Server returned a non-JSON error page");
    }
  } catch (error) {
    // fallback for non-JSON errors
    if (error.name === "SyntaxError" || error.message.includes("non-JSON")) {
      console.error("Notion server response is not JSON:", error);
      // handle/display user-friendly error
      return { error: "Server returned a non-JSON error page." };
    }
    // handle all other errors
    console.error("Error saving to Notion:", error);
    return { error: error.message };
  }
}

// Example usage:
const properties = {
  // Notion database structure နှင့် ကိုက်ညီအောင်ယ်ရေးပါ
  "Title": {
    title: [
      {
        text: {
          content: "Test Entry"
        }
      }
    ]
  }
};

saveToNotion(properties);
