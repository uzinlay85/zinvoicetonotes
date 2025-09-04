ZinVoiceNotes - အသံဖြင့် မှတ်စုမှတ်သားခြင်း App
ZinVoiceNotes သည် Google Gemini AI ကို အသုံးပြု၍ အသံကို စာသားအဖြစ်သို့ အလိုအလျောက်ပြောင်းလဲပေးပြီး မှတ်စုများကို လွယ်ကူစွာ သိမ်းဆည်းနိုင်ရန် တည်ဆောက်ထားသော web application တစ်ခုဖြစ်သည်။ ထို့အပြင် မှတ်စုများကို သင်၏ Notion Database ထဲသို့ တိုက်ရိုက်ပေးပို့ သိမ်းဆည်းနိုင်သည့် ချိတ်ဆက်မှုလည်း ပါဝင်သည်။

အဓိကလုပ်ဆောင်ချက်များ (Features)
အသံမှ စာသားသို့ ပြောင်းလဲခြင်း: Google Gemini 1.5 Flash AI ကို အသုံးပြု၍ မြန်မာဘာသာစကားအပါအဝင် အသံများကို တိကျစွာ စာသားအဖြစ် ပြောင်းလဲပေးသည်။

မှတ်စု စီမံခန့်ခွဲမှု: မှတ်သားထားသော မှတ်စုများကို ပြန်လည်ကြည့်ရှုခြင်း၊ ပြင်ဆင်ခြင်း၊ နှင့် ဖျက်ပစ်ခြင်းတို့ကို ပြုလုပ်နိုင်သည်။

Notion နှင့် ချိတ်ဆက်ခြင်း: မှတ်စုများကို သင်၏ ကိုယ်ပိုင် Notion database ထဲသို့ ခလုတ်တစ်ချက်နှိပ်ရုံဖြင့် ပေးပို့သိမ်းဆည်းနိုင်သည်။

Data Export & Import: မှတ်စုများအားလုံးကို JSON format ဖြင့် export လုပ်နိုင်ပြီး၊ JSON ဖိုင်မှတစ်ဆင့် import ပြန်လည်ပြုလုပ်နိုင်သည်။

ရိုးရှင်းသော User Interface: သုံးစွဲသူများ အလွယ်တကူ နားလည်အသုံးပြုနိုင်ရန် ရိုးရှင်းသပ်ရပ်စွာ ဒီဇိုင်းပြုလုပ်ထားသည်။

နည်းပညာများ (Technology Stack)
Frontend: HTML, Tailwind CSS, Vanilla JavaScript

AI Model: Google Gemini AI

Backend: Netlify Serverless Functions (Node.js)

Deployment: Netlify

API Clients: @notionhq/client

တည်ဆောက်ထားပုံ (Project Structure)
ဤ project ကို Frontend နှင့် Backend အပိုင်းများ ရှင်းလင်းစွာ ခွဲခြားထားသော serverless architecture ဖြင့် တည်ဆောက်ထားသည်။

/
├── functions/
│   └── saveToNotion.js    # Notion API နှင့် ချိတ်ဆက်ပေးသော Backend Logic (Serverless Function)
│
├── index.html             # Application ၏ Frontend UI နှင့် Logic အားလုံးပါဝင်သော အဓိကဖိုင်
├── netlify.toml           # Netlify အတွက် Deployment နှင့် Redirect Rules များ သတ်မှတ်ပေးသောဖိုင်
└── package.json           # Backend function အတွက် လိုအပ်သော Node.js dependencies များကို သတ်မှတ်ပေးသောဖိုင်

ဖိုင်များ ချိတ်ဆက်အလုပ်လုပ်ပုံ
index.html (Frontend): သုံးစွဲသူက "Save to Notion" ခလုတ်ကို နှိပ်လိုက်သည့်အခါ၊ JavaScript သည် /api/saveToNotion လိပ်စာသို့ fetch request တစ်ခု ပို့လွှတ်သည်။

netlify.toml (Routing): ဤဖိုင်ထဲရှိ [[redirects]] rule က /api/* ဖြင့် လာသော request မှန်သမျှကို /.netlify/functions/ ထဲရှိ သက်ဆိုင်ရာ function ဆီသို့ ပို့ဆောင်ပေးရန် Netlify ကို လမ်းညွှန်ပေးသည်။

functions/saveToNotion.js (Backend): Netlify server ပေါ်တွင် ဤ function အလုပ်လုပ်ပြီး၊ frontend မှ ပေးပို့လိုက်သော Notion API Key, Database ID, နှင့် မှတ်စုအကြောင်းအရာတို့ကို လက်ခံရယူသည်။ ထို့နောက် Notion API ကို အသုံးပြု၍ သက်ဆိုင်ရာ database ထဲသို့ စာမျက်နှာအသစ်တစ်ခုအနေဖြင့် သိမ်းဆည်းပေးသည်။

Response: သိမ်းဆည်းမှု အောင်မြင်/မအောင်မြင် ဆိုသည့်အကြောင်းကို backend function က frontend သို့ response ပြန်ပို့ပေးပြီး၊ index.html ထဲရှိ JavaScript က သက်ဆိုင်ရာ message ကို သုံးစွဲသူအား ပြသပေးသည်။

အသုံးပြုနည်း (Setup and Usage)
ဤ project ကို သင်ကိုယ်တိုင် deploy လုပ်ပြီး အသုံးပြုလိုပါက အောက်ပါအဆင့်များအတိုင်း လုပ်ဆောင်နိုင်ပါသည်။

လိုအပ်ချက်များ
Google AI Studio မှ Gemini API Key

Notion Integration Token

သင်မှတ်စုသိမ်းဆည်းလိုသော Notion Database ID

Netlify account

GitHub account

အဆင့်များ
Repository ကို Fork/Clone လုပ်ခြင်း:
ဤ repository ကို သင်၏ GitHub account ထဲသို့ fork လုပ်ပါ သို့မဟုတ် local computer ထဲသို့ clone လုပ်ပါ။

git clone [https://github.com/your-username/zinvoicetonotes.git](https://github.com/your-username/zinvoicetonotes.git)

Netlify တွင် Deploy လုပ်ခြင်း:

Netlify dashboard သို့သွားပြီး "Add new site" > "Import an existing project" ကိုရွေးပါ။

သင်၏ GitHub account နှင့် ချိတ်ဆက်ပြီး သင် fork/clone လုပ်ထားသော repository ကို ရွေးချယ်ပါ။

Build settings များသည် netlify.toml ဖိုင်ထဲတွင် အလိုအလျောက်ပါဝင်ပြီးဖြစ်သောကြောင့် မည်သည့်အရာမှ ပြင်ဆင်ရန်မလိုဘဲ "Deploy site" ကို နှိပ်လိုက်ပါ။

Application ကို စတင်အသုံးပြုခြင်း:

Deploy ပြီးဆုံးသွားပါက Netlify မှ ပေးသော သင်၏ website link (https://your-site-name.netlify.app) သို့ သွားပါ။

Settings tab ကိုသွားပါ။

သင်ရယူထားသော Gemini API Key, Notion Integration Token, နှင့် Notion Database ID တို့ကို သက်ဆိုင်ရာအကွက်များတွင် ဖြည့်စွက်ပြီး "Save" ခလုတ်များကို နှိပ်ပါ။

သင်၏ Notion Database တွင် သင်ပြုလုပ်ထားသော integration ကို "Can edit" permission ပေးရန် မမေ့ပါနှင့်။

အသံဖြင့် မှတ်စုမှတ်ခြင်း:

Home tab ကိုပြန်သွားပြီး မိုက်ခရိုဖုန်းခလုတ်ကို နှိပ်ကာ အသံဖြင့် စတင်မှတ်စုမှတ်နိုင်ပါပြီ။

မှတ်စုများကို Notes tab တွင် ကြည့်ရှုနိုင်ပြီး Notion သို့ ပေးပို့နိုင်ပါသည်။

License
This project is licensed under the MIT License.
