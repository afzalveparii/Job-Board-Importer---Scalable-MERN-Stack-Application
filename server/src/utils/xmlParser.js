import axios from 'axios';
import xml2js from 'xml2js';

// export const fetchAndParseXML = async (url) => {
//   try {
//     const response = await axios.get(url, {
//       timeout: 30000,
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//       },
//     });

//     const parser = new xml2js.Parser({
//       explicitArray: false,
//       mergeAttrs: true,
//       ignoreAttrs: false,
//     });

//     const result = await parser.parseStringPromise(response.data);
//     return result;
//   } catch (error) {
//     throw new Error(`XML Parse Error for ${url}: ${error.message}`);
//   }
// };


export const fetchAndParseXML = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    });

    // Try with different parser settings
    const parser = new xml2js.Parser({
      explicitArray: false,      // Don't force arrays
      mergeAttrs: true,           // Merge attributes
      ignoreAttrs: false,         // Keep attributes
      trim: true,                 // Trim whitespace
      normalize: true,            // Normalize text
      normalizeTags: false,       // Don't lowercase tags
      explicitRoot: false,        // Don't include root wrapper
    });

    const result = await parser.parseStringPromise(response.data);
    
    console.log('📄 Parsed XML structure:', JSON.stringify(result, null, 2).substring(0, 500));
    
    return result;
  } catch (error) {
    throw new Error(`XML Parse Error for ${url}: ${error.message}`);
  }
};

export const transformJobData = (rawJob, sourceUrl) => {
  // Generate unique ID
  const externalId = rawJob.guid || `${sourceUrl}-${Date.now()}-${Math.random()}`;

  return {
    externalId: String(externalId).substring(0, 255),
    title: rawJob.title || 'Untitled Job',
    company: rawJob.company || rawJob.creator || 'N/A',
    location: rawJob.location || rawJob['job:location'] || 'Remote',
    description: rawJob.description || rawJob.summary || '',
    url: rawJob.link || rawJob.url || '',
    category: rawJob.category || 'General',
    jobType: rawJob.jobType || rawJob['job:type'] || 'Full-time',
    salary: rawJob.salary || rawJob['job:salary'] || '',
    postedDate: rawJob.pubDate ? new Date(rawJob.pubDate) : new Date(),
    sourceUrl,
  };
};

// export const extractJobs = (xmlData) => {
//   // Handle different XML structures
//   if (xmlData.rss?.channel?.item) {
//     return Array.isArray(xmlData.rss.channel.item)
//       ? xmlData.rss.channel.item
//       : [xmlData.rss.channel.item];
//   }

//   if (xmlData.feed?.entry) {
//     return Array.isArray(xmlData.feed.entry)
//       ? xmlData.feed.entry
//       : [xmlData.feed.entry];
//   }

//   throw new Error('Unsupported XML structure');
// };


export const extractJobs = (xmlData) => {
  console.log('🔍 Detecting XML structure...');
  console.log('📄 Root keys:', Object.keys(xmlData));

  // Check for API error response
  if (xmlData.channel?.error) {
    const error = xmlData.channel.error;
    console.error('❌ API Error Response:', error.message);
    console.error('Invalid categories:', error.invalid_categories);
    console.error('Available categories:', error.available_categories);
    
    throw new Error(
      `API Error: ${error.message}. Invalid: "${error.invalid_categories}". ` +
      `Use one of: ${error.available_categories}`
    );
  }

  // RSS 2.0 format (most common)
  if (xmlData.channel?.item) {
    const items = xmlData.channel.item;
    const jobs = Array.isArray(items) ? items : [items];
    console.log(`✅ Found ${jobs.length} jobs in RSS format`);
    return jobs;
  }

  // RSS with rss.channel.item
  if (xmlData.rss?.channel?.item) {
    const items = xmlData.rss.channel.item;
    const jobs = Array.isArray(items) ? items : [items];
    console.log(`✅ Found ${jobs.length} jobs in RSS format`);
    return jobs;
  }

  // Atom feed format
  if (xmlData.feed?.entry) {
    const entries = xmlData.feed.entry;
    const jobs = Array.isArray(entries) ? entries : [entries];
    console.log(`✅ Found ${jobs.length} jobs in Atom format`);
    return jobs;
  }

  // Direct items
  if (xmlData.item) {
    const items = xmlData.item;
    const jobs = Array.isArray(items) ? items : [items];
    console.log(`✅ Found ${jobs.length} jobs in direct format`);
    return jobs;
  }

  // Error with detailed info
  console.error('❌ Unsupported XML structure');
  console.error('Available keys:', Object.keys(xmlData));
  
  throw new Error(`Unsupported XML structure. Root keys: ${Object.keys(xmlData).join(', ')}`);
};
