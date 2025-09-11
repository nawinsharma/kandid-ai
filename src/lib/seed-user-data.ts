import { db, tables } from './db';
import { eq } from 'drizzle-orm';

// Sample campaigns data (from main seed file)
const sampleCampaigns = [
  {
    name: "Just Herbs",
    description: "Outreach campaign for Just Herbs brand partnerships",
    status: "active",
    totalLeads: 20,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect and discuss potential collaboration opportunities with Just Herbs.",
    connectionMessage: "Thanks for connecting! I'd love to learn more about your work at {company}.",
    followupMessages: [
      "Hi {name}, I hope you're doing well! I wanted to follow up on my previous message about potential collaboration opportunities.",
      "Hi {name}, I understand you're busy, but I'd love to share some insights that might be valuable for {company}."
    ],
    settings: {
      autopilot: true,
      personalization: true,
      selectedAccounts: ["linkedin_1", "linkedin_2"]
    }
  },
  {
    name: "Juicy chemistry",
    description: "Connecting with beauty and wellness industry professionals",
    status: "active",
    totalLeads: 11,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect and share insights about the beauty industry.",
    connectionMessage: "Thanks for connecting! I have some interesting insights about beauty trends that might interest you.",
    followupMessages: [
      "Hi {name}, I hope you're having a great week! I wanted to share some industry insights that might be relevant.",
      "Hi {name}, I understand you're focused on growth. I have some strategies that helped similar brands increase their reach."
    ],
    settings: {
      autopilot: false,
      personalization: true,
      selectedAccounts: ["linkedin_3"]
    }
  },
  {
    name: "Hyugalife 2",
    description: "Building connections with health and wellness professionals",
    status: "active",
    totalLeads: 19,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect with fellow health and wellness professionals!",
    connectionMessage: "Thanks for connecting! Looking forward to sharing wellness insights.",
    followupMessages: [
      "Hi {name}, I hope you're doing well! I wanted to share some wellness trends that might interest you."
    ],
    settings: {
      autopilot: false,
      personalization: true,
      selectedAccounts: ["linkedin_1"]
    }
  },
  {
    name: "Honeyveda",
    description: "Targeting Ayurveda and natural health practitioners",
    status: "active",
    totalLeads: 3,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect and discuss Ayurveda and natural health trends.",
    connectionMessage: "Thanks for connecting! I have some insights about natural health that might be valuable.",
    followupMessages: [
      "Hi {name}, I hope you're doing well! I wanted to follow up on our previous conversation about natural health solutions.",
      "Hi {name}, I understand you're passionate about Ayurveda. I'd love to share some case studies that might be relevant."
    ],
    settings: {
      autopilot: true,
      personalization: true,
      selectedAccounts: ["linkedin_1", "linkedin_4"]
    }
  },
  {
    name: "HempStreet",
    description: "Connecting with cannabis and hemp industry professionals",
    status: "active",
    totalLeads: 7,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect and discuss hemp industry trends.",
    connectionMessage: "Thanks for connecting! I'm passionate about hemp innovation and would love to share insights.",
    followupMessages: [
      "Hi {name}, I hope you're doing well! I wanted to share some recent developments in hemp tech that might interest you."
    ],
    settings: {
      autopilot: false,
      personalization: true,
      selectedAccounts: ["linkedin_5"]
    }
  },
  {
    name: "HealthyHey 2",
    description: "Outreach to health and fitness industry leaders",
    status: "active",
    totalLeads: 5,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect and discuss health and fitness trends.",
    connectionMessage: "Thanks for connecting! I have some insights about health trends that might be valuable.",
    followupMessages: [
      "Hi {name}, I hope you're doing well! I wanted to share some fitness industry insights that might interest you."
    ],
    settings: {
      autopilot: false,
      personalization: true,
      selectedAccounts: ["linkedin_1"]
    }
  },
  {
    name: "Herbal Chakra",
    description: "Connecting with herbal medicine and wellness practitioners",
    status: "active",
    totalLeads: 19,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect and discuss herbal medicine trends.",
    connectionMessage: "Thanks for connecting! I'm passionate about herbal wellness and would love to share insights.",
    followupMessages: [
      "Hi {name}, I hope you're doing well! I wanted to share some herbal medicine insights that might interest you."
    ],
    settings: {
      autopilot: false,
      personalization: true,
      selectedAccounts: ["linkedin_1"]
    }
  },
  {
    name: "Healofy",
    description: "Building connections with healthcare and wellness professionals",
    status: "active",
    totalLeads: 14,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect and discuss healthcare innovation trends.",
    connectionMessage: "Thanks for connecting! I have some insights about healthcare that might be valuable.",
    followupMessages: [
      "Hi {name}, I hope you're doing well! I wanted to share some healthcare trends that might interest you."
    ],
    settings: {
      autopilot: false,
      personalization: true,
      selectedAccounts: ["linkedin_1"]
    }
  },
  {
    name: "HealthSense",
    description: "Targeting health technology and wellness professionals",
    status: "active",
    totalLeads: 2,
    successfulLeads: 0,
    responseRate: 0.00,
    requestMessage: "Hi {name}, I'd love to connect and discuss health technology trends.",
    connectionMessage: "Thanks for connecting! I have some insights about health tech that might be valuable.",
    followupMessages: [
      "Hi {name}, I hope you're doing well! I wanted to share some health tech insights that might interest you."
    ],
    settings: {
      autopilot: false,
      personalization: true,
      selectedAccounts: ["linkedin_1"]
    }
  }
];

// Sample leads data (from main seed file)
const sampleLeads = [
  // Just Herbs Campaign leads
  {
    name: "Sumeet Malhotra",
    email: "sumeet.malhotra@justherbs.com",
    title: "Don't Stop When you tired Stop when You're done",
    company: "Just Herbs",
    linkedinUrl: "https://linkedin.com/in/sumeetmalhotra",
    profileImage: "https://i.pravatar.cc/150?img=1",
    status: "pending",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Sumeet, I'd love to connect and discuss potential collaboration opportunities with Just Herbs.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Megha Sabhlok",
    email: "megha.sabhlok@justherbs.com",
    title: "Co-founder, Just Herbs (acquired by Mari)",
    company: "Just Herbs",
    linkedinUrl: "https://linkedin.com/in/meghasabhlok",
    profileImage: "https://i.pravatar.cc/150?img=2",
    status: "pending",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Megha, I'd love to connect and discuss potential collaboration opportunities with Just Herbs.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Archee P.",
    email: "archee.p@justherbs.com",
    title: "Content and Marketing Specialist at Just",
    company: "Just Herbs",
    linkedinUrl: "https://linkedin.com/in/archeep",
    profileImage: "https://i.pravatar.cc/150?img=3",
    status: "pending",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Archee, I'd love to connect and discuss potential collaboration opportunities with Just Herbs.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Hindustan Herbs",
    email: "contact@hindustanherbs.com",
    title: "Co-Founder at Hindustan Herbs",
    company: "Hindustan Herbs",
    linkedinUrl: "https://linkedin.com/company/hindustanherbs",
    profileImage: "https://i.pravatar.cc/150?img=4",
    status: "pending",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi, I'd love to connect and discuss potential collaboration opportunities with Hindustan Herbs.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Ritika Ohri",
    email: "ritika.ohri@justherbs.com",
    title: "Brand Manager: Marketing, Talent and Inn",
    company: "Just Herbs",
    linkedinUrl: "https://linkedin.com/in/ritikaohri",
    profileImage: "https://i.pravatar.cc/150?img=5",
    status: "pending",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Ritika, I'd love to connect and discuss potential collaboration opportunities with Just Herbs.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Praveen Kumar Gautam",
    email: "praveen.gautam@justherbs.com",
    title: "Vice President - Offline Sales @ Just He",
    company: "Just Herbs",
    linkedinUrl: "https://linkedin.com/in/praveengautam",
    profileImage: "https://i.pravatar.cc/150?img=6",
    status: "pending",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Praveen, I'd love to connect and discuss potential collaboration opportunities with Just Herbs.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Shubham Saboo",
    email: "shubham.saboo@justherbs.com",
    title: "Associated as C&F Agent & Superstockiest",
    company: "Just Herbs",
    linkedinUrl: "https://linkedin.com/in/shubhamsaboo",
    profileImage: "https://i.pravatar.cc/150?img=7",
    status: "pending",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Shubham, I'd love to connect and discuss potential collaboration opportunities with Just Herbs.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Megha Sabhlok",
    email: "megha.sabhlok2@justherbs.com",
    title: "Brand Director at Just Herbs",
    company: "Just Herbs",
    linkedinUrl: "https://linkedin.com/in/meghasabhlok2",
    profileImage: "https://i.pravatar.cc/150?img=8",
    status: "pending",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Megha, I'd love to connect and discuss potential collaboration opportunities with Just Herbs.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  // Gynoveda Campaign leads
  {
    name: "Om Satyarthy",
    email: "om.satyarthy@gynoveda.com",
    title: "Regional Head",
    company: "Gynoveda",
    linkedinUrl: "https://linkedin.com/in/omsatyarthy",
    profileImage: "https://i.pravatar.cc/150?img=9",
    status: "pending_approval",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Om, I'd love to connect and discuss potential collaboration opportunities with Gynoveda.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Dr. Bhuvaneshwari",
    email: "dr.bhuvaneshwari@gynoveda.com",
    title: "Fertility & Women's Health A",
    company: "Gynoveda",
    linkedinUrl: "https://linkedin.com/in/drbhuvaneshwari",
    profileImage: "https://i.pravatar.cc/150?img=10",
    status: "sent_7_mins_ago",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Dr. Bhuvaneshwari, I'd love to connect and discuss potential collaboration opportunities with Gynoveda.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Surdeep Singh",
    email: "surdep.singh@gynoveda.com",
    title: "Building Product-led SEO Growt",
    company: "Gynoveda",
    linkedinUrl: "https://linkedin.com/in/surdeepsingh",
    profileImage: "https://i.pravatar.cc/150?img=11",
    status: "sent_7_mins_ago",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Surdeep, I'd love to connect and discuss potential collaboration opportunities with Gynoveda.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Dilbag Singh",
    email: "dilbag.singh@gynoveda.com",
    title: "Manager Marketing & Communicat",
    company: "Gynoveda",
    linkedinUrl: "https://linkedin.com/in/dilbagsingh",
    profileImage: "https://i.pravatar.cc/150?img=12",
    status: "sent_7_mins_ago",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Dilbag, I'd love to connect and discuss potential collaboration opportunities with Gynoveda.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  {
    name: "Vanshy Jain",
    email: "vanshy.jain@gynoveda.com",
    title: "Ayurveda||primary infertility|",
    company: "Gynoveda",
    linkedinUrl: "https://linkedin.com/in/vanshyjain",
    profileImage: "https://i.pravatar.cc/150?img=13",
    status: "sent_7_mins_ago",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Vanshy, I'd love to connect and discuss potential collaboration opportunities with Gynoveda.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  // Digi Sidekick Campaign leads
  {
    name: "Sunil Pal",
    email: "sunil.pal@digisidekick.com",
    title: "Helping Fashion & Lifestyle Br",
    company: "Digi Sidekick",
    linkedinUrl: "https://linkedin.com/in/sunilpal",
    profileImage: "https://i.pravatar.cc/150?img=14",
    status: "pending_approval",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Sunil, I'd love to connect and discuss potential collaboration opportunities with Digi Sidekick.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  // The skin story Campaign leads
  {
    name: "Utkarsh K.",
    email: "utkarsh.k@theskinstory.com",
    title: "Airbnb Host | Ex-The Skin Stor",
    company: "The skin story",
    linkedinUrl: "https://linkedin.com/in/utkarshk",
    profileImage: "https://i.pravatar.cc/150?img=15",
    status: "do_not_contact",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Utkarsh, I'd love to connect and discuss potential collaboration opportunities with The skin story.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  // Pokonut Campaign leads
  {
    name: "Shreya Ramakrishna",
    email: "shreya.ramakrishna@pokonut.com",
    title: "Deputy Manager - Founder's Off",
    company: "Pokonut",
    linkedinUrl: "https://linkedin.com/in/shreyaramakrishna",
    profileImage: "https://i.pravatar.cc/150?img=16",
    status: "followup_10_mins_ago",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Shreya, I'd love to connect and discuss potential collaboration opportunities with Pokonut.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  },
  // Re'equil Campaign leads
  {
    name: "Deepak Kumar",
    email: "deepak.kumar@reequil.com",
    title: "Deputy manager Advertising and",
    company: "Re'equil",
    linkedinUrl: "https://linkedin.com/in/deepakkumar",
    profileImage: "https://i.pravatar.cc/150?img=17",
    status: "followup_10_mins_ago",
    activity: 4,
    lastContactDate: new Date("2024-02-20T10:30:00Z"),
    interactionHistory: [
      {
        type: "connection_request",
        message: "Hi Deepak, I'd love to connect and discuss potential collaboration opportunities with Re'equil.",
        timestamp: "2024-02-15T09:00:00Z",
        status: "sent"
      }
    ]
  }
];

// Sample LinkedIn accounts data (from main seed file)
const sampleLinkedinAccounts = [
  {
    name: "Pulkit Garg",
    email: "1999pulkitgarg@gmail.com",
    status: "connected",
    requestsSent: 17,
    requestsLimit: 30,
    progress: 56.67
  },
  {
    name: "Jivesh Lakhani",
    email: "jivesh@gmail.com",
    status: "connected",
    requestsSent: 19,
    requestsLimit: 30,
    progress: 63.33
  },
  {
    name: "Indrajit Sahani",
    email: "indrajit38mp@gmail.com",
    status: "connected",
    requestsSent: 18,
    requestsLimit: 30,
    progress: 60.00
  },
  {
    name: "Bhavya Arora",
    email: "bhavyaarora199.ba@gmail.com",
    status: "connected",
    requestsSent: 18,
    requestsLimit: 100,
    progress: 18.00
  }
];

export async function seedUserData(userId: string) {
  try {
    console.log(`Starting data seeding for user: ${userId}`);
    
    // Check if user already has data
    const existingCampaigns = (
      await db.select({ count: tables.campaigns.id }).from(tables.campaigns).where(eq(tables.campaigns.userId, userId))
    ).length;
    
    if (existingCampaigns > 0) {
      console.log(`⚠️  User ${userId} already has campaigns. Skipping seeding.`);
      return;
    }
    
    // Create LinkedIn accounts first
    console.log("Creating LinkedIn accounts...");
    const insertedLinkedinAccounts = await db
      .insert(tables.linkedinAccounts)
      .values(sampleLinkedinAccounts.map(a => ({
        id: crypto.randomUUID(),
        name: a.name,
        email: a.email,
        status: a.status,
        requestsSent: a.requestsSent,
        requestsLimit: a.requestsLimit,
        progress: a.progress.toFixed(2),
        userId,
      })))
      .returning({ id: tables.linkedinAccounts.id });
    const linkedinAccounts = insertedLinkedinAccounts;
    console.log(`Created ${linkedinAccounts.length} LinkedIn accounts`);
    
    // Create campaigns
    console.log("Creating campaigns...");
    const insertedCampaigns = await db
      .insert(tables.campaigns)
      .values(sampleCampaigns.map(c => ({
        id: crypto.randomUUID(),
        name: c.name,
        description: c.description,
        status: c.status,
        totalLeads: c.totalLeads,
        successfulLeads: c.successfulLeads,
        responseRate: c.responseRate.toFixed(2),
        requestMessage: c.requestMessage,
        connectionMessage: c.connectionMessage,
        followupMessages: c.followupMessages,
        settings: c.settings,
        userId,
      })))
      .returning({ id: tables.campaigns.id });
    const campaigns = insertedCampaigns;
    console.log(`Created ${campaigns.length} campaigns`);
    
    // Create leads and associate them with campaigns
    const leadsPerCampaign = Math.ceil(sampleLeads.length / campaigns.length);
    
    for (let i = 0; i < campaigns.length; i++) {
      const campaign = campaigns[i];
      const startIndex = i * leadsPerCampaign;
      const endIndex = Math.min(startIndex + leadsPerCampaign, sampleLeads.length);
      const campaignLeads = sampleLeads.slice(startIndex, endIndex);
      
      if (campaignLeads.length) {
        await db.insert(tables.leads).values(
          campaignLeads.map(l => ({ id: crypto.randomUUID(), ...l, campaignId: campaign.id, userId }))
        );
      }
    }
    
    const totalLeads = (
      await db.select({ id: tables.leads.id }).from(tables.leads).where(eq(tables.leads.userId, userId))
    ).length;
    console.log(`✅ Created ${totalLeads} leads`);
    
    console.log("🎉 User data seeding completed successfully!");
    console.log(`📊 Summary for user ${userId}:`);
    console.log(`- LinkedIn Accounts: ${linkedinAccounts.length}`);
    console.log(`- Campaigns: ${campaigns.length}`);
    console.log(`- Leads: ${totalLeads}`);
    
    return {
      linkedinAccounts: linkedinAccounts.length,
      campaigns: campaigns.length,
      leads: totalLeads
    };
    
  } catch (error) {
    console.error(` Error seeding data for user ${userId}:`, error);
    throw error;
  }
}

export async function checkAndSeedUserData(userId: string) {
  try {
    // Check if user exists
    const user = await db
      .select()
      .from(tables.users)
      .where(eq(tables.users.id, userId))
      .limit(1);
    
    if (!user.length) {
      console.log(`  User ${userId} not found. Skipping seeding.`);
      return;
    }
    
    // Check if user already has data
    const existingCampaigns = (
      await db.select({ id: tables.campaigns.id }).from(tables.campaigns).where(eq(tables.campaigns.userId, userId))
    ).length;
    
    if (existingCampaigns > 0) {
      return;
    }
    
    // Seed data for the user
    return await seedUserData(userId);
    
  } catch (error) {
    throw error;
  }
}
