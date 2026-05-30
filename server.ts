import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK securely on the server-side
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// Helper: Get specific header by name
function getHeader(headers: { name: string; value: string }[], name: string): string {
  const match = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
  return match ? match.value : '';
}

// Helper: Safe Base64url decoding
function decodeBase64(data: string): string {
  if (!data) return '';
  const normalized = data.replace(/-/g, '+').replace(/_/g, '/');
  try {
    return Buffer.from(normalized, 'base64').toString('utf-8');
  } catch (err) {
    console.error("Base64 decode failed:", err);
    return '';
  }
}

// Helper: Extract recursive plain/HTML body
function getEmailBody(payload: any): string {
  if (!payload) return '';
  
  if (payload.body && payload.body.data) {
    if (payload.mimeType === 'text/plain' || payload.mimeType === 'text/html') {
      return decodeBase64(payload.body.data);
    }
  }
  
  if (payload.parts) {
    // 1. Seek plain text
    const plainPart = payload.parts.find((p: any) => p.mimeType === 'text/plain');
    if (plainPart?.body?.data) {
      return decodeBase64(plainPart.body.data);
    }
    
    // 2. Seek html text
    const htmlPart = payload.parts.find((p: any) => p.mimeType === 'text/html');
    if (htmlPart?.body?.data) {
      return decodeBase64(htmlPart.body.data);
    }
    
    // 3. Deep dive recursively
    for (const nested of payload.parts) {
      const nestedBody = getEmailBody(nested);
      if (nestedBody) return nestedBody;
    }
  }
  
  return '';
}

interface ParsedGmailEmail {
  id: string;
  threadId: string;
  sender: string;
  subject: string;
  date: string;
  snippet: string;
  body: string;
  isRead: boolean;
}

// Helper: Transform raw Gmail format to ParsedGmailEmail
function parseGmailEmail(gmailMsg: any): ParsedGmailEmail {
  const headers = gmailMsg.payload?.headers || [];
  const sender = getHeader(headers, 'From') || 'Unknown Sender';
  const subject = getHeader(headers, 'Subject') || '(No Subject)';
  const date = getHeader(headers, 'Date') || new Date().toUTCString();
  const isRead = !(gmailMsg.labelIds || []).includes('UNREAD');
  
  let body = getEmailBody(gmailMsg.payload);
  if (body.includes('<') && body.includes('>')) {
    // Basic regex to strip noisy HTML tags for cheaper LLM token ingestion
    body = body
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
  
  const truncatedBody = body.length > 1500 ? body.substring(0, 1500) + '... (truncated)' : body;
  
  return {
    id: gmailMsg.id,
    threadId: gmailMsg.threadId,
    sender,
    subject,
    date,
    snippet: gmailMsg.snippet || '',
    body: truncatedBody || gmailMsg.snippet || '(No body text)',
    isRead,
  };
}

// Fallback high-fidelity sample student/professional emails if real inbox is completely empty
const sampleEmails: ParsedGmailEmail[] = [
  {
    id: "demo-1",
    threadId: "thread-1",
    sender: "Google Careers <internships-noreply@google.com>",
    subject: "Google SWE Internship 2026 - Invitation to Technical Interview",
    date: "Fri, 29 May 2026 14:15:22 GMT",
    snippet: "Congratulations! We have and reviewed your resume and would love to invite you to our virtual interview. Please submit your availability by June 15.",
    body: "Hi Code Explorer,\n\nWe are absolutely thrilled to extend an invitation for you to schedule your Technical Interview for the 2026 Software Engineering Internship position! Your portfolio and GitHub projects really stood out to our engineering team.\n\nThe next step is a 45-minute live coding assessment focused on data structures and algorithms.\n\nDeadline to choose a slot: June 15, 2026.\nLink: https://careers.google.com/dashboard/schedule\n\nBest regards,\nGoogle Talent Team",
    isRead: false
  },
  {
    id: "demo-2",
    threadId: "thread-2",
    sender: "University Administration Office <admin@pacificvarsity.edu>",
    subject: "URGENT: Semester Tuition Fee Due & Scholarship Allocation Check",
    date: "Thu, 28 May 2026 09:30:00 GMT",
    snippet: "Your semester assessment bill is ready. Please confirm your scholarship waiver apply code. Direct payment due date: June 10, 2026.",
    body: "Dear Student,\n\nThis is an official administrative reminder that the spring tuition payment portal will close on June 10, 2026 to prevent enrollment holds. \n\nDetails of your current balances:\n- Tuition & Fees: $4,250\n- Academic Scholarship Allocation: -$3,000\n- Pending Balance: $1,250\n\nPlease finalize this balance or request payment plans at the Bursar office as soon as possible.\n\nRegards,\nOffice of Finance",
    isRead: false
  },
  {
    id: "demo-3",
    threadId: "thread-3",
    sender: "Global Hackathon Group <organizers@hacksummit.dev>",
    subject: "Congratulations: Your HackSummit 2026 Project is Accepted!",
    date: "Wed, 27 May 2026 18:40:11 GMT",
    snippet: "Your project team has been approved for our main hacker cohort in Singapore! Please confirm travel grants by June 5.",
    body: "Hey HackSummit Hackers,\n\nWe had over 2,400 team submissions, and we are ecstatic to inform you that your workspace has been approved for the final live builder cohort on June 22-24!\n\nTravel grants are available for students up to $400. You need to submit your flight invoice scan before June 5 to authorize reimbursement.\n\nSee you on the stage!\n\nHackSummit Executive Committee",
    isRead: true
  },
  {
    id: "demo-4",
    threadId: "thread-4",
    sender: "Amazon Student Programs <student-recruiting@amazon.com>",
    subject: "Follow-up: Amazon Future Engineer Scholarship Application Support",
    date: "Tue, 26 May 2026 11:22:05 GMT",
    snippet: "Thank you for starting your Amazon scholarship portal. Complete your letter of recommendation references before June 8, 2026.",
    body: "Hello Friend,\n\nWe noticed you have a pending draft submission for the Amazon Future Engineer Scholarship.\n\nReminder of necessary materials:\n1. Personal essay upload (Done)\n2. Academic transcript (Done)\n3. Two teacher Reference contact details (Pending - Due Date is June 8, 2026)\n\nDon't let this $10,000 opportunity slide! Access your dashboard and complete these references immediately.\n\nAmazon Community Team",
    isRead: false
  },
  {
    id: "demo-5",
    threadId: "thread-5",
    sender: "Steam Games <noreply@steampowered.com>",
    subject: "Summer Mega Sales Active & Special Discount Inside!",
    date: "Mon, 25 May 2026 23:59:00 GMT",
    snippet: "Your wishlist items are now on discount! Cyberpunk and Elden Ring up to 60% off.",
    body: "Hi Gamer,\n\nGood news! Handpicked games on your Steam Wishlist are on extreme discount for our annual summer games event. Get Cyberpunk 2077 at 60% off and Elden Ring for 35% off. Offer expires next Monday.\n\nHave fun,\nSteam Support",
    isRead: true
  }
];

// ----------------------------------------------------
// Express Backend APIs
// ----------------------------------------------------

// 1. API: Fetch & Analyze Gmail Inbox
app.post('/api/emails/analyze', async (req, res) => {
  const { accessToken, forceRefresh } = req.body;
  
  if (!accessToken) {
    return res.status(400).json({ error: "Access token is required" });
  }
  
  try {
    let emailsToAnalyze: ParsedGmailEmail[] = [];
    let isSimulationMode = false;
    
    try {
      // Fetch latest 15 messages from Gmail list
      const listUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15`;
      const listRes = await fetch(listUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      
      if (!listRes.ok) {
        throw new Error(`Gmail API list call returned status ${listRes.status}`);
      }
      
      const listData = (await listRes.json()) as { messages?: { id: string; threadId: string }[] };
      if (listData.messages && listData.messages.length > 0) {
        // Fetch details in parallel
        const dPromises = listData.messages.map(async (msg) => {
          const detailUrl = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`;
          const detailRes = await fetch(detailUrl, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          if (detailRes.ok) {
            const rawJson = await detailRes.json();
            return parseGmailEmail(rawJson);
          }
          return null;
        });
        
        const decoded = await Promise.all(dPromises);
        emailsToAnalyze = decoded.filter((e): e is ParsedGmailEmail => e !== null);
      }
    } catch (apiErr) {
      console.warn("Gmail API fetching failed or token was invalid. Falling back to high-fidelity Simulation Mode:", apiErr);
      isSimulationMode = true;
    }
    
    // Fallback to beautiful default simulated database if real mailbox yields nothing/fails
    if (emailsToAnalyze.length === 0) {
      emailsToAnalyze = sampleEmails;
      isSimulationMode = true;
    }
    
    // Construct rich analysis prompt for Gemini 3.5 Flash
    const textPrompt = `You are Sahaya, an elite, intuitive AI email chief of staff for Yogi (a hard-working Computer Science / Engineering student and professional).
Analyze the following list of ${emailsToAnalyze.length} emails from Yogi's inbox. Perform structured analyses, score them, extract critical opportunities, timeline deadlines, evaluate sentiment plus sender mapping, and formulate a stunning daily briefings summary and executive markdown weekly reports.

Here is the structured list of ${emailsToAnalyze.length} emails:
${emailsToAnalyze.map((mail, idx) => `
--- EMAIL #${idx + 1} ---
ID: ${mail.id}
ThreadID: ${mail.threadId}
Sender/From: ${mail.sender}
Subject: ${mail.subject}
Date: ${mail.date}
Snippet: ${mail.snippet}
Clean Body Context:
${mail.body}
--------------------
`).join('\n')}

Based on this content, popuate a JSON response adhering strictly to the responseSchema provided. Be precise, highly contextual, and elegant.`;

    // Define strict response structure
    const analysisSchema = {
      type: Type.OBJECT,
      properties: {
        briefing: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A friendly, conversational morning brief (2-3 sentences) summarizing overall status, highlight 1 key opportunity, and warning of close deadlines." },
            criticalCount: { type: Type.INTEGER },
            opportunityCount: { type: Type.INTEGER },
            deadlineCount: { type: Type.INTEGER },
            pendingRepliesCount: { type: Type.INTEGER }
          },
          required: ["summary", "criticalCount", "opportunityCount", "deadlineCount", "pendingRepliesCount"]
        },
        emails: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              subject: { type: Type.STRING },
              sender: { type: Type.STRING },
              date: { type: Type.STRING },
              snippet: { type: Type.STRING },
              importanceScore: { type: Type.INTEGER, description: "Score from 0 to 100 based on sender authority, action demands, and academic/career opportunities." },
              category: { type: Type.STRING, description: "Must be EXACTLY one of: 'Career', 'Education', 'Finance', 'Personal', 'Security', 'Promotions', 'Newsletters', 'Social'." },
              sentiment: { type: Type.STRING, description: "Must be EXACTLY one of: 'Positive', 'Neutral', 'Negative', 'Urgent'." },
              summary: { type: Type.STRING, description: "Concise, rich 1-sentence description." },
              actionRequired: { type: Type.BOOLEAN, description: "True if action/reply is necessary from Yogi." },
              actionLabel: { type: Type.STRING, description: "Short call-to-action e.g. 'Submit Availability', 'Pay Balance', 'Contact References' (or empty if none)" }
            },
            required: ["id", "subject", "sender", "date", "snippet", "importanceScore", "category", "sentiment", "summary", "actionRequired", "actionLabel"]
          }
        },
        opportunities: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING, description: "Opportunity title (e.g. Google Internship)" },
              entity: { type: Type.STRING, description: "Entity/Organization" },
              deadline: { type: Type.STRING, description: "Formatted end date (abbreviated month day or DD-MM-YYYY)" },
              description: { type: Type.STRING, description: "Short details or bulleted deliverables" },
              type: { type: Type.STRING, description: "EXACTLY one of: 'Internship', 'Scholarship', 'Job', 'Competition', 'Hackathon', 'Other'" },
              emailId: { type: Type.STRING }
            },
            required: ["id", "title", "entity", "deadline", "description", "type", "emailId"]
          }
        },
        deadlines: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              event: { type: Type.STRING, description: "Actionable event title" },
              date: { type: Type.STRING, description: "Formatted date string YYYY-MM-DD or Month/Day" },
              type: { type: Type.STRING },
              urgency: { type: Type.STRING, description: "EXACTLY one of: 'High', 'Medium', 'Low'" },
              emailId: { type: Type.STRING }
            },
            required: ["id", "event", "date", "type", "urgency", "emailId"]
          }
        },
        relationships: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              frequency: { type: Type.INTEGER, description: "Frequency index 1 to 10" },
              importanceScore: { type: Type.INTEGER, description: "0-100 indicating criticalness of origin" },
              relationshipType: { type: Type.STRING, description: "Short descriptive categorizer (e.g. Corporate Recruiter, Academic Office, Personal, Promotion Admin)" }
            },
            required: ["name", "email", "frequency", "importanceScore", "relationshipType"]
          }
        },
        trends: {
          type: Type.OBJECT,
          properties: {
            careerEmailsPercentChange: { type: Type.NUMBER },
            promoEmailsPercentChange: { type: Type.NUMBER },
            unreadEmailsPercentChange: { type: Type.NUMBER },
            healthScore: { type: Type.NUMBER, description: "Overall inbox health score from 0-100 based on pending tasks and unread counts." }
          },
          required: ["careerEmailsPercentChange", "promoEmailsPercentChange", "unreadEmailsPercentChange", "healthScore"]
        },
        weeklyReport: {
          type: Type.STRING,
          description: "Stunning, styled Markdown Executive report compiling overall inbox statistics, highlighted hot-topic internships/opportunities, upcoming timeline summary, and AI intelligence suggestions."
        }
      },
      required: ["briefing", "emails", "opportunities", "deadlines", "relationships", "trends", "weeklyReport"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: textPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        temperature: 0.2,
      },
    });

    const results = JSON.parse(response.text.trim());
    
    // Carry over isSimulation flag so the UI can friendly notify the user
    res.json({
      ...results,
      isSimulation: isSimulationMode
    });
    
  } catch (error: any) {
    console.error("Analysis route error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze inbox." });
  }
});

// 2. API: Chat Assistant with Inbox Context
app.post('/api/emails/chat', async (req, res) => {
  const { query, analyzedContext, chatHistory } = req.body;
  
  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }
  
  try {
    const formattedEmails = (analyzedContext?.emails || []).map((e: any, idx: number) => `
Email #${idx + 1}:
Sender: ${e.sender}
Subject: ${e.subject}
Summary: ${e.summary}
Category: ${e.category}
Importance: ${e.importanceScore}/100
Actionable: ${e.actionRequired ? 'Yes - ' + e.actionLabel : 'No'}
`).join('\n');

    const chatPrompt = `You are Sahaya, Yogi's AI email chief of staff. Below is the list of analyzed emails and timeline milestones from Yogi's current inbox.

--- EMAIL METADATA CONTEXT ---
${formattedEmails}

--- DETECTED OPPORTUNITIES ---
${JSON.stringify(analyzedContext?.opportunities || [], null, 2)}

--- EXTRACTED DEADLINES ---
${JSON.stringify(analyzedContext?.deadlines || [], null, 2)}

Answer Yogi's query directly, accurately, and with professional, friendly guidance. If Yogi asks to search or fetch specific emails (e.g. internships, college), pull specific matches from the context above and highlight dates and labels. Keep it crisp and beautifully formatted under 3-4 paragraphs max. Do not invent any emails not represented in the metadata context!

User Query: "${query}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: chatPrompt,
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: err.message || "Chat assistant error." });
  }
});

// 3. API: Generate Professional Reply Draft
app.post('/api/emails/reply', async (req, res) => {
  const { sender, subject, body, customInstruction } = req.body;
  
  try {
    const draftPrompt = `You are Sahaya Mail Intelligence assistant drafting a reply on behalf of Yogi.
Original Email Sender: ${sender}
Original Subject: ${subject}
Original Body:
${body}

User Specific Reply Instruction/Tone: "${customInstruction || "Generate a polite and professional response."}"

Please generate a professional, warm, context-appreciative draft email reply. Highlight next steps or necessary answers elegantly. Return ONLY the raw drafted plaintext content. Do not write any markdown code blocks, metadata prefixes, or headers. Just the draft body.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: draftPrompt,
    });

    res.json({ draft: response.text });
  } catch (err: any) {
    console.error("Reply drafting error:", err);
    res.status(500).json({ error: err.message || "Failed to generate mail draft." });
  }
});

// 4. API: Send Real Gmail Message (Mutating - call with user confirmation only!)
app.post('/api/emails/send-reply', async (req, res) => {
  const { accessToken, to, subject, body, threadId } = req.body;
  
  if (!accessToken || !to || !subject || !body) {
    return res.status(400).json({ error: "Missing required arguments to send email (accessToken, to, subject, body)." });
  }
  
  try {
    // Construct valid RFC 2822 email payload
    const rfcLines = [
      `To: ${to}`,
      `Subject: ${subject.startsWith('Re:') ? subject : 'Re: ' + subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      body
    ];
    
    const rfcMessage = rfcLines.join('\r\n');
    // Gmail API expects web-safe Base64 encoding without padding
    const webSafeBase64Url = Buffer.from(rfcMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
      
    const gmailSendUrl = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
    
    const sendBody: any = { raw: webSafeBase64Url };
    if (threadId) {
      sendBody.threadId = threadId;
    }
    
    const sendRes = await fetch(gmailSendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sendBody)
    });
    
    if (!sendRes.ok) {
      const errText = await sendRes.text();
      throw new Error(`Gmail API send failed with status ${sendRes.status} : ${errText}`);
    }
    
    const sendJson = await sendRes.json();
    res.json({ success: true, messageId: sendJson.id, threadId: sendJson.threadId });
    
  } catch (err: any) {
    console.error("Sending email error:", err);
    res.status(500).json({ error: err.message || "Failed to send Gmail message." });
  }
});

// Vite & Static file handling
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sahaya Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
