const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
`  // Load community posts from Supabase
  useEffect(() => {
    fetchCommunityPosts().then((posts) => {
      if (posts && posts.length > 0) {
        setCommunityPosts(posts);
      }
    });
  }, []);`,
`  // Load community posts from Supabase and subscribe to real-time changes
  useEffect(() => {
    fetchCommunityPosts().then((posts) => {
      setCommunityPosts(posts || []);
    });
    
    let subscription = null;
    if (supabase) {
      subscription = supabase
        .channel('community_posts_channel')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'community_posts' },
          (payload) => {
            fetchCommunityPosts().then((posts) => setCommunityPosts(posts || []));
          }
        )
        .subscribe();
    }
    
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);`);

fs.writeFileSync('src/App.tsx', code);
