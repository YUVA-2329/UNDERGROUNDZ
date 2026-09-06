const fs = require('fs');
let code = fs.readFileSync('src/data.ts', 'utf8');
code = code.replace(/export const INITIAL_COMMUNITY_POSTS: CommunityPost\[\] = \[([\s\S]*?)\];/, 'export const INITIAL_COMMUNITY_POSTS: CommunityPost[] = [];');
fs.writeFileSync('src/data.ts', code);
