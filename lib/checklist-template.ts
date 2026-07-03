// Default Publishing Checklist Template
// Based on: 06_SAMPLE_PUBLISHING_CHECKLIST_TEMPLATE.md

export const defaultChecklistTemplate = [
  // Session Setup
  { category: "Session Setup", title: "Import package successfully", required: true, orderIndex: 1 },
  { category: "Session Setup", title: "Confirm metadata", required: true, orderIndex: 2 },
  { category: "Session Setup", title: "Confirm session title", required: true, orderIndex: 3 },
  { category: "Session Setup", title: "Confirm category and theme", required: true, orderIndex: 4 },
  { category: "Session Setup", title: "Confirm Founder Pathway Stage", required: true, orderIndex: 5 },
  
  // Core Content
  { category: "Core Content", title: "Review clean transcript", required: true, orderIndex: 6 },
  { category: "Core Content", title: "Approve core message", required: true, orderIndex: 7 },
  { category: "Core Content", title: "Review final CTA", required: true, orderIndex: 8 },
  
  // YouTube Long-Form
  { category: "YouTube Long-Form", title: "Approve YouTube title", required: true, orderIndex: 9 },
  { category: "YouTube Long-Form", title: "Approve description", required: true, orderIndex: 10 },
  { category: "YouTube Long-Form", title: "Approve chapters", required: false, orderIndex: 11 },
  { category: "YouTube Long-Form", title: "Approve tags / keywords", required: false, orderIndex: 12 },
  { category: "YouTube Long-Form", title: "Select final thumbnail", required: true, orderIndex: 13 },
  { category: "YouTube Long-Form", title: "Produce long-form visual / audio visual", required: true, orderIndex: 14 },
  { category: "YouTube Long-Form", title: "Upload long-form video", required: true, orderIndex: 15 },
  { category: "YouTube Long-Form", title: "Add to proper playlist", required: true, orderIndex: 16 },
  { category: "YouTube Long-Form", title: "Add final live URL", required: true, orderIndex: 17 },
  
  // YouTube Podcast
  { category: "YouTube Podcast", title: "Approve podcast title", required: true, orderIndex: 18 },
  { category: "YouTube Podcast", title: "Approve podcast description", required: true, orderIndex: 19 },
  { category: "YouTube Podcast", title: "Approve podcast cover / static visual", required: true, orderIndex: 20 },
  { category: "YouTube Podcast", title: "Produce podcast video version", required: true, orderIndex: 21 },
  { category: "YouTube Podcast", title: "Upload podcast episode", required: true, orderIndex: 22 },
  { category: "YouTube Podcast", title: "Add to podcast playlist / set as podcast episode", required: true, orderIndex: 23 },
  { category: "YouTube Podcast", title: "Add final live URL", required: true, orderIndex: 24 },
  
  // YouTube Shorts
  { category: "YouTube Shorts", title: "Approve Short 1", required: true, orderIndex: 25 },
  { category: "YouTube Shorts", title: "Approve Short 2", required: true, orderIndex: 26 },
  { category: "YouTube Shorts", title: "Approve Short 3", required: false, orderIndex: 27 },
  { category: "YouTube Shorts", title: "Approve Short 4", required: false, orderIndex: 28 },
  { category: "YouTube Shorts", title: "Approve Short 5", required: false, orderIndex: 29 },
  { category: "YouTube Shorts", title: "Upload approved Shorts", required: true, orderIndex: 30 },
  { category: "YouTube Shorts", title: "Add live URLs for uploaded Shorts", required: true, orderIndex: 31 },
  
  // YouTube Community
  { category: "YouTube Community", title: "Approve community post", required: true, orderIndex: 32 },
  { category: "YouTube Community", title: "Approve community image if used", required: false, orderIndex: 33 },
  { category: "YouTube Community", title: "Publish community post", required: true, orderIndex: 34 },
  { category: "YouTube Community", title: "Add final live URL", required: true, orderIndex: 35 },
  
  // SKOOL
  { category: "SKOOL", title: "Approve SKOOL post", required: true, orderIndex: 36 },
  { category: "SKOOL", title: "Approve SKOOL image if used", required: false, orderIndex: 37 },
  { category: "SKOOL", title: "Publish SKOOL post", required: true, orderIndex: 38 },
  { category: "SKOOL", title: "Add final live URL", required: false, orderIndex: 39 },
  
  // NotebookLM
  { category: "NotebookLM", title: "Review NotebookLM source", required: true, orderIndex: 40 },
  { category: "NotebookLM", title: "Review NotebookLM generation instructions", required: true, orderIndex: 41 },
  { category: "NotebookLM", title: "Upload source to NotebookLM", required: true, orderIndex: 42 },
  { category: "NotebookLM", title: "Mark NotebookLM upload complete", required: true, orderIndex: 43 },
  { category: "NotebookLM", title: "Add NotebookLM notes / link if applicable", required: false, orderIndex: 44 },
  
  // Visual Assets
  { category: "Visual Assets", title: "Review thumbnail options", required: true, orderIndex: 45 },
  { category: "Visual Assets", title: "Approve podcast graphic", required: true, orderIndex: 46 },
  { category: "Visual Assets", title: "Approve community graphic", required: false, orderIndex: 47 },
  { category: "Visual Assets", title: "Approve SKOOL graphic", required: false, orderIndex: 48 },
  { category: "Visual Assets", title: "Approve Founder visual if relevant", required: false, conditional: true, orderIndex: 49 },
  
  // Founder Pathway Review
  { category: "Founder Pathway Review", title: "Confirm content stage alignment", required: true, orderIndex: 50 },
  { category: "Founder Pathway Review", title: "Confirm CTA is appropriate for current audience stage", required: true, orderIndex: 51 },
  { category: "Founder Pathway Review", title: "Flag for founder review if direct invitation language exists", required: false, conditional: true, orderIndex: 52 },
  { category: "Founder Pathway Review", title: "Approve Founder positioning", required: true, orderIndex: 53 },
  
  // Final Publish & Archive
  { category: "Final Publish & Archive", title: "Confirm publishing matrix updated", required: true, orderIndex: 54 },
  { category: "Final Publish & Archive", title: "Confirm export files generated", required: true, orderIndex: 55 },
  { category: "Final Publish & Archive", title: "Confirm original ZIP preserved", required: true, orderIndex: 56 },
  { category: "Final Publish & Archive", title: "Mark session complete", required: true, orderIndex: 57 },
  { category: "Final Publish & Archive", title: "Archive version snapshot", required: true, orderIndex: 58 }
];
